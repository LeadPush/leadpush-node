import type { Leadpush } from '../leadpush'
import type { WorkspaceOverview } from './workspaces.model'

export class Workspace {
    constructor(private readonly client: Leadpush) {}

    async get(): Promise<WorkspaceOverview> {
        return (await this.client.get<{ data: WorkspaceOverview }>('workspace')).data
    }
}
