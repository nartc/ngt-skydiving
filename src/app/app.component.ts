import { Component } from '@angular/core';
import { NgtCanvas } from 'angular-three';
import { NgtsLoader } from 'angular-three-soba/loaders';
import { Scene } from './scene.component';

@Component({
	selector: 'app-root',
	template: `
		<ngt-canvas
			[sceneGraph]="scene"
			[camera]="{ fov: 70, position: [0, 0, 3] }"
			[gl]="{ useLegacyLights: true }"
		/>
		<ngts-loader />
	`,
	standalone: true,
	imports: [NgtCanvas, NgtsLoader],
})
export class AppComponent {
	scene = Scene;
}
