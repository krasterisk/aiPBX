---
schema_version: 1
open_count: 2
waived_count: 0
fixed_count: 0
total_count: 2
last_updated: 2026-08-10T09:15:02.999Z
---

# Broken Windows Ledger

> Cross-phase defect register. `/gsd-ship` blocks while `open_count > 0`.
> Waive with `gsd-tools windows waive <id> "<reason>"` (reason required).
> Mark fixed with `gsd-tools windows fixed <id>`.

| id | phase | kind | file | line | description | status | reason | recorded_at | resolved_at |
|----|-------|------|------|------|-------------|--------|--------|-------------|-------------|
| 1 | 11 | stub | src/features/PlaygroundSession/ui/PlaygroundSessionV2/PlaygroundSessionV2.tsx |  | Setup Drawer stub body until 11-02 | open |  | 2026-08-10T09:15:01.900Z |  |
| 2 | 11 | stub | src/features/PlaygroundSession/ui/PlaygroundSessionV2/PlaygroundSessionV2.tsx |  | Debug Drawer stub body until 11-03 | open |  | 2026-08-10T09:15:02.999Z |  |

````json
[
  {
    "id": 1,
    "kind": "stub",
    "phase": "11",
    "file": "src/features/PlaygroundSession/ui/PlaygroundSessionV2/PlaygroundSessionV2.tsx",
    "line": null,
    "description": "Setup Drawer stub body until 11-02",
    "status": "open",
    "reason": "",
    "recorded_at": "2026-08-10T09:15:01.900Z",
    "resolved_at": null
  },
  {
    "id": 2,
    "kind": "stub",
    "phase": "11",
    "file": "src/features/PlaygroundSession/ui/PlaygroundSessionV2/PlaygroundSessionV2.tsx",
    "line": null,
    "description": "Debug Drawer stub body until 11-03",
    "status": "open",
    "reason": "",
    "recorded_at": "2026-08-10T09:15:02.999Z",
    "resolved_at": null
  }
]
````
