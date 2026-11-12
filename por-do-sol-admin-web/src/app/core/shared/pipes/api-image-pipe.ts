import { Pipe, PipeTransform, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageLoaderService } from '../../services/image-loader-service';

@Pipe({ name: 'apiImage' })
export class ApiImagePipe implements PipeTransform {
  private readonly loader = inject(ImageLoaderService)

  transform(url: string | null | undefined): Observable<string | null> {
    return this.loader.load(url)
  }
}
