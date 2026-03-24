import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GraphService } from './graph.service';
import { ITechnologyRepository } from '../../common/interfaces';

describe('GraphService', () => {
  let graphService: GraphService;
  let techRepoMock: ITechnologyRepository;

  beforeEach(() => {
    techRepoMock = {
      create: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findBySemVer: vi.fn(),
    };
    graphService = new GraphService(techRepoMock);
  });

  it('should build React Flow graph nodes', async () => {
    vi.spyOn(techRepoMock, 'findAll').mockResolvedValue([{ id: '1', name: 'node', version: '20' }]);
    
    const graph = await graphService.buildReactFlowGraph();
    
    expect(graph.nodes).toHaveLength(1);
    expect(graph.nodes[0].id).toBe('1');
    expect(graph.nodes[0].data.label).toBe('node v20');
  });
});
