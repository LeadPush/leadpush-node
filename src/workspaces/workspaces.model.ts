export interface WorkspaceOverview {
    workspace: { uuid: string, name: string, state: string }
    role: string
    counts: {
        contacts: number
        campaigns: number
        segments: number
        newsletters: number
        verified_domains: number
    }
    sending: { workspace_setup: boolean, has_verified_domain: boolean }
}
