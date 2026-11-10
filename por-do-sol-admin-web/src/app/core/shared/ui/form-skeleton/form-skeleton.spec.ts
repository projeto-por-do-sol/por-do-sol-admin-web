import { TestBed } from '@angular/core/testing';
import { FormSkeleton, FormSkeletonRow } from './form-skeleton';

describe('FormSkeleton', () => {
  async function render(sections: FormSkeletonRow[][]) {
    const fixture = TestBed.createComponent(FormSkeleton);
    fixture.componentRef.setInput('sections', sections);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('cria uma seção para cada grupo de linhas', async () => {
    const element = await render([['field'], ['pair'], ['chips']]);

    expect(element.querySelectorAll('.sectionCard').length).toBe(3);
  });

  it('desenha os campos pedidos em cada linha', async () => {
    const countSkeletons = async (row: FormSkeletonRow) =>
      (await render([[row]])).querySelector('.sectionCard')!.querySelectorAll('app-skeleton').length;

    // Cada contagem inclui o título da seção.
    expect(await countSkeletons('field')).toBe(1 + 2);
    expect(await countSkeletons('pair')).toBe(1 + 4);
    expect(await countSkeletons('fieldAction')).toBe(1 + 3);
    expect(await countSkeletons('pairAction')).toBe(1 + 5);
    expect(await countSkeletons('chips')).toBe(1 + 7);
  });

  it('fica oculto para leitores de tela', async () => {
    const element = await render([['field']]);

    expect(element.getAttribute('aria-hidden')).toBe('true');
  });
});
