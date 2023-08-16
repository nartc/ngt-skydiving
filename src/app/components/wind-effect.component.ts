import { CUSTOM_ELEMENTS_SCHEMA, Component, computed } from '@angular/core';
import {
	NgtArgs,
	NgtRepeat,
	injectBeforeRender,
	injectNgtRef,
	injectNgtStore,
} from 'angular-three';
import {
	NgtsInstance,
	NgtsInstances,
	PositionMesh,
} from 'angular-three-soba/performances';
import { NgtsSobaContent } from 'angular-three-soba/utils';
import * as THREE from 'three';

@Component({
	selector: 'app-wind-shape',
	standalone: true,
	template: `
		<ngts-instance
			color="white"
			[instanceRef]="ref"
			[position]="[randomPosition.x, randomPosition.y, randomPosition.z]"
		/>
	`,
	imports: [NgtsInstance],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WindShape {
	v3 = new THREE.Vector3();
	randomPosition = {
		x: THREE.MathUtils.randFloatSpread(8),
		y: THREE.MathUtils.randFloatSpread(5),
		z: THREE.MathUtils.randFloatSpread(8),
	};
	randomSpeed = THREE.MathUtils.randFloat(0.05, 0.5);

	ref = injectNgtRef<PositionMesh>();

	private store = injectNgtStore();
	private getCurrentViewport = this.store.get('viewport', 'getCurrentViewport');
	private height = computed(() => this.getCurrentViewport().height);

	constructor() {
		injectBeforeRender(({ camera }) => {
			const instance = this.ref.nativeElement;
			if (instance) {
				const { height: elHeight } = (instance.instance.nativeElement as any)
					.geometry.parameters;
				const worldPosition = instance.getWorldPosition(this.v3);
				const limitPos = this.height() - (worldPosition.y + elHeight / 2);
				if (limitPos < 0) {
					instance.position.y = -(this.height() + elHeight / 2);
				}
				instance.position.y += this.randomSpeed;
				instance.rotation.y = camera.rotation.y;
			}
		});
	}
}

@Component({
	selector: 'app-wind-effect',
	standalone: true,
	template: `
		<ngt-group>
			<ngts-instances>
				<ng-template ngtsSobaContent>
					<ngt-plane-geometry *args="[0.0135, 1.2]" />
					<ngt-mesh-basic-material
						[side]="DoubleSide"
						[blending]="AdditiveBlending"
						[opacity]="0.15"
						[transparent]="true"
					/>
					<app-wind-shape *ngFor="let i; repeat: 130" />
				</ng-template>
			</ngts-instances>
		</ngt-group>
	`,
	imports: [NgtsInstances, NgtsSobaContent, NgtArgs, WindShape, NgtRepeat],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WindEffect {
	DoubleSide = THREE.DoubleSide;
	AdditiveBlending = THREE.AdditiveBlending;
}
