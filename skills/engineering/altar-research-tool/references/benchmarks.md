# Feasibility spikes and benchmarks

Use for spikes and for comparing an Altar candidate against the real reference. A number is evidence only with its fixture, settings, machine state and the command that produced it.

## Never wait on an unbounded job

- Put every run under a watchdog. macOS has no `timeout`; use `perl -e 'alarm shift; exec @ARGV' 600 <command>`.
- Run long jobs in the background, print progress, and check that progress instead of waiting silently. A model compile (for example CoreML) can run for an hour with no output.
- If a run exceeds its budget, stop it and report that as a finding.

## Timing

- Use mains power with Low Power Mode off, and run no other batch or render at the same time. Record the machine and power state.
- Report cold time (compile, first load, model warm-up) separately from warm per-frame time. Cache compiled models between runs, and say whether a number includes that cache.
- In AE, time with `aerender`, one comp per run, so the RAM or disk cache cannot serve frames. Mark probe effects as time-varying. To bust the disk cache, add a fresh Slider Control before the effect.
- Create every `aerender` output folder before the run, or each run fails.
- After an `aerender` batch, check that the GUI AE and its Bridge are still connected before the next live probe.

## Quality

- Define the ground truth exactly and match it. For motion blur, the shutter angle of the ground-truth exposure must equal the angle being compared.
- Compare in the same colour space and bit depth on both sides. Decide whether the comparison happens in linear or display space, and state which.
- Use a fixed fixture set. Record dataset licences before publishing any of its frames.
- With a vendor trial, render the reference at zero strength to get the watermark mask, and exclude those pixels from scoring.
- Report the metric, the per-shot values and the comparison settings, not just a verdict.
