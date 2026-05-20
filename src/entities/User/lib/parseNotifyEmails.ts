export function parseNotifyEmails(raw: string): string[] {
    return Array.from(new Set(
        raw.split(/[\n,;\s]+/).map((e) => e.trim().toLowerCase()).filter(Boolean),
    ))
}
