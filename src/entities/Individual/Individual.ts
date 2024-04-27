import { shuffleArray } from '@/utils';

type Gene = number;

export class Individual {
  constructor(public genes: Gene[] = []) {}

  mutate(mutationRate: number): this {
    if (Math.random() < mutationRate) {
      this.genes = shuffleArray(this.genes);
    }
    return this;
  }

  crossover(partner: Individual): [Individual, Individual] {
    const sectionPoint = Math.floor(this.genes.length * 0.75);
    const half = Math.random() < 0.5 ? 'start' : 'end';

    const newGenes1 = this.combineGenes(this.genes, partner.genes, sectionPoint, half);
    const newGenes2 = this.combineGenes(partner.genes, this.genes, sectionPoint, half);

    return [new Individual(newGenes1), new Individual(newGenes2)];
  }

  private combineGenes(
    genes1: Gene[],
    genes2: Gene[],
    sectionPoint: number,
    half: 'start' | 'end' = 'start'
  ): Gene[] {
    switch (half) {
      case 'start':
        return this.combineFromStart(genes1, genes2, sectionPoint);
      case 'end':
        return this.combineFromEnd(genes1, genes2, sectionPoint);
      default:
        throw new Error('Invalid half');
    }
  }

  private combineFromStart(genes1: Gene[], genes2: Gene[], sectionPoint: number): Gene[] {
    const startSection = genes1.slice(0, sectionPoint);

    return startSection.concat(
      genes2.reduce<Gene[]>((newGene, gene) => {
        if (!newGene.includes(gene) && !startSection.includes(gene)) {
          newGene.push(gene);
        }
        return newGene;
      }, [])
    );
  }

  private combineFromEnd(genes1: Gene[], genes2: Gene[], sectionPoint: number): Gene[] {
    const endSection = genes1.slice(sectionPoint, genes1.length);

    return genes2
      .reduce<Gene[]>((newGene, gene) => {
        if (!newGene.includes(gene) && !endSection.includes(gene)) {
          newGene.push(gene);
        }
        return newGene;
      }, [])
      .concat(endSection);
  }
}
