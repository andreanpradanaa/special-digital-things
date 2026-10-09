#!/usr/bin/env node
// Dipanggil oleh block-git-commit.sh. Membaca JSON hook dari stdin,
// memeriksa tool_input.command, dan menolak bila ada segmen perintah
// yang DIMULAI dengan `git commit` / `git push` (boleh didahului sudo, env VAR=, atau spasi).
// Teks di dalam string berkutip atau badan heredoc tidak dihitung.

let raw = ''
process.stdin.on('data', (c) => (raw += c))
process.stdin.on('end', () => {
  let command = ''
  try {
    command = JSON.parse(raw)?.tool_input?.command ?? ''
  } catch {
    process.exit(0)
  }
  if (typeof command !== 'string' || !command) process.exit(0)

  const hit = findBlockedSegment(command)
  if (hit) {
    process.stderr.write(
      `Ditolak oleh .claude/hooks/block-git-commit.sh: "${hit}". ` +
        'Claude tidak boleh commit/push di repo ini — usulkan pesan commit, user yang menjalankannya.\n',
    )
    process.exit(2)
  }
  process.exit(0)
})

function findBlockedSegment(command) {
  // 1. Buang badan heredoc (<<EOF ... EOF, <<'EOF', <<-EOF)
  const lines = command.split('\n')
  const kept = []
  let marker = null
  for (const line of lines) {
    if (marker !== null) {
      if (line.replace(/^\t+/, '') === marker) marker = null
      continue
    }
    const m = line.match(/<<-?\s*(['"]?)([A-Za-z_][A-Za-z0-9_]*)\1/)
    if (m) marker = m[2]
    kept.push(line)
  }
  // 2. Kosongkan isi string berkutip supaya `echo "git commit"` tidak terdeteksi
  const stripped = kept.join('\n').replace(/"(?:[^"\\]|\\.)*"|'[^']*'/g, '""')
  // 3. Pecah per segmen: awal baris, ; && || |
  const segments = stripped.split(/\n|;|&&|\|\||\|/)
  for (let seg of segments) {
    seg = seg.trim()
    // lepaskan sudo, env VAR=..., dan tanda kurung/subshell di depan
    seg = seg.replace(/^(\(|\{|sudo\s+(-\S+\s+)*|[A-Za-z_][A-Za-z0-9_]*=\S*\s+)+/, '').trim()
    if (/^git\s+(commit|push)\b/.test(seg)) return seg.slice(0, 60)
  }
  return null
}
