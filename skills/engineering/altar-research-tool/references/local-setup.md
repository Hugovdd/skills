# Hugo's local research setup

Installed 2026-11-17. These are machine-specific defaults, not requirements for other users.

## Tools and ownership

- `~/.local/bin/rea`: launcher for REA 6.9.0 under `~/.local/share/rea/app`.
- Dedicated Node 24.22.3 under `~/.local/share/rea/runtime`. The system's Nix-managed Node is unchanged.
- Native provider: Ghidra 12.1.4 and Temurin JDK 21 under `~/.local/share/rea/providers`. The launcher supplies `GHIDRA_INSTALL_DIR` and `JAVA_HOME` unless explicitly overridden.
- Codex and Claude Code registrations use absolute Node/REA paths and explicit provider environment. Changing only shell PATH does not update an already running MCP server.
- jsxer: `~/Desktop/+/GitHub/jsxer-hugo/bin/debug/jsxer` (release fallback in `bin/release`). The existing REA 6.5.0 submodule at `tools/rea` is retained for old investigations; do not accidentally invoke it for the current workflow.
- Skills live in `~/Desktop/+/GitHub/skills/skills/engineering/`: this skill and the matching upstream `reverse-engineer-anything` skill. Host directories contain links, not independent copies. Do not let the setup wizard replace managed links.

## Everyday commands

Use absolute target paths and a separate evidence directory:

```bash
~/.local/bin/rea analyze-javascript-application /absolute/research/decoded --json > /absolute/research/evidence/javascript.json
~/.local/bin/rea decompile /absolute/path/to/native-executable --procedure FUNCTION --provider ghidra --json > /absolute/research/evidence/function.json
```

Discover exact procedure names/addresses first; the second command is a template. Native analysis reads the file without loading it into AE. A persistent MCP session is preferable for multiple native queries to avoid repeating analysis startup.

The existing `tools/decode.sh` in jsxer-hugo handles raw JSXBIN and simple double-quoted wrappers. It writes into shared `scratch/output/`; choose unique basenames or use jsxer directly on a copied raw literal in a product-specific directory. Inspect output before moving it into the investigation.

Known decoder traps: raw input must start with `@JSXBIN@`; UTF-8 BOM/leading whitespace and an `eval(...)` wrapper must be handled first. The existing wrapper extractor is not a general JavaScript parser and should not be trusted for escaped, concatenated or multiple literals. Never evaluate a wrapper to extract it. A decoder can print an invalid-signature error and still exit zero/create an empty `.jsx`: inspect diagnostics and output content before treating the decode as successful. In the current checkout, `tests/data/jsxbin/array-expr.jsxbin` is empty; use the known raw sample in `bindings/python/decompiler.py` for the smoke test.

## Readiness and updates

Do not run a global doctor before every investigation. For a real blocker:

```bash
~/.local/bin/rea doctor --client codex --provider ghidra --json
~/.local/bin/rea doctor --client claude_code --provider ghidra --json
~/.local/bin/rea doctor --skill --json
```

Other optional engines can be absent while this workflow works. Frida's optional native installation was not enabled; runtime injection is not required for static JavaScript/Ghidra analysis or Altar-based AE observation.

The official Ghidra 12.1.4 archive did not include a macOS native decompiler. This installation builds the shipped C++ source using Xcode's compiler, with `make -j8 ghidra_opt 'CXX=clang++ -std=c++11' 'ARCH_TYPE=-arch arm64' 'ADDITIONAL_FLAGS=-mmacosx-version-min=11.0' OSDIR=mac_arm_64` from `Ghidra/Features/Decompiler/src/decompile/cpp`, then installs `ghidra_opt` as executable `Ghidra/Features/Decompiler/os/mac_arm_64/decompile`. On a provider replacement, check this again: the source Makefile defaults to x86_64 on Darwin, so an unmodified `make` is not sufficient for Apple Silicon.

REA's skill doctor deliberately reports linked skill directories as `unmanaged`/`symbolic_link`; that is expected for this Home Manager layout, not evidence that the agent cannot read the skill. Validate the link target and compare the managed source files with the installed package's `skills/reverse-engineer-anything` instead. Do not replace the links with standalone global copies to make this check green. Client/provider readiness is checked separately.

To update, check the new package's Node requirement first. This installation is a pnpm project, not an npm global installation, so update its pinned dependency with pnpm and retain the lockfile. Invoke pnpm through the dedicated Node explicitly: this machine's pnpm shim has a fixed Nix Node shebang, so a PATH change alone does not select the new runtime. Refresh the matching bundled skill in the managed source repository, preserving the upstream license, and preview client changes:

```bash
~/.local/bin/rea setup --client codex --client claude_code --skill=false --dry-run
```

Apply authorized changes with the same command plus `--yes` instead of `--dry-run`. Keep setup-generated backups, preserve unrelated MCP servers and restart the affected clients. Never run an unrelated whole-machine Nix upgrade just to refresh this installation. After a Node/provider path change, refresh both the launcher and the agent registrations.

Verification and historical investigation notes are kept privately at `~/Desktop/+/GitHub/jsxer-hugo/scratch/rea-setup/`. Read that history only when a previous investigation is relevant; it is not a prerequisite for a new target.
