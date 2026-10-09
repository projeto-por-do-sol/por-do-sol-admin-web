import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  input,
  output,
  viewChild,
} from '@angular/core';
import * as L from 'leaflet';

export interface MapLocation {
  latitude: number
  longitude: number
}

@Component({
  selector: 'app-location-map',
  templateUrl: './location-map.html',
  styleUrl: './location-map.css',
})
export class LocationMap implements AfterViewInit, OnDestroy {
  private readonly mapElement =
    viewChild.required<ElementRef<HTMLDivElement>>('mapElement')

  readonly initialLatitude = input<number | null>(null)
  readonly initialLongitude = input<number | null>(null)
  readonly locationChange = output<MapLocation>()

  private map?: L.Map
  private selectedPoint?: L.CircleMarker
  private resizeObserver?: ResizeObserver

  ngAfterViewInit(): void {
    const hasInitialLocation =
      this.initialLatitude() !== null && this.initialLongitude() !== null

    const initialPosition: L.LatLngExpression = hasInitialLocation
      ? [this.initialLatitude()!, this.initialLongitude()!]
      : [-23.9608, -46.3336]

    this.map = L.map(this.mapElement().nativeElement, {
      center: initialPosition,
      zoom: hasInitialLocation ? 17 : 13,
    })

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map)

    if (hasInitialLocation) {
      this.drawSelectedPoint(
        this.initialLatitude()!,
        this.initialLongitude()!,
      )
    }

    this.map.on('click', (event: L.LeafletMouseEvent) => {
      this.selectLocation(event.latlng.lat, event.latlng.lng)
    })

    if (!hasInitialLocation) {
      this.centerOnUserLocation()
    }

    this.observeContainerSize()
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect()
    this.map?.remove()
  }

  private observeContainerSize(): void {
    const element = this.mapElement().nativeElement

    const refreshMapSize = () => {
      requestAnimationFrame(() => {
        this.map?.invalidateSize({
          animate: false,
          pan: false,
        })
      })
    }

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(refreshMapSize)
      this.resizeObserver.observe(element)
    }

    setTimeout(refreshMapSize)
  }

  private centerOnUserLocation(): void {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        this.map?.setView([coords.latitude, coords.longitude], 16)
      },
      () => {
      },
      {
        enableHighAccuracy: true,
        timeout: 10_000,
        maximumAge: 60_000,
      },
    )
  }

  private selectLocation(latitude: number, longitude: number): void {
    const location = {
      latitude: Number(latitude.toFixed(7)),
      longitude: Number(longitude.toFixed(7)),
    }

    this.drawSelectedPoint(location.latitude, location.longitude)
    this.locationChange.emit(location)
  }

  private drawSelectedPoint(latitude: number, longitude: number): void {
    if (!this.map) return

    const position: L.LatLngExpression = [latitude, longitude]

    if (this.selectedPoint) {
      this.selectedPoint.setLatLng(position)
      return
    }

    this.selectedPoint = L.circleMarker(position, {
      radius: 9,
      color: '#7A2200',
      fillColor: '#C0420A',
      fillOpacity: 1,
      weight: 3,
    }).addTo(this.map)
  }
}
