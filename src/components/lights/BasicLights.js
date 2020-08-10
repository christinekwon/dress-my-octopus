import { Group, SpotLight, AmbientLight, HemisphereLight, SpotLightHelper } from 'three';

class BasicLights extends Group {
    constructor(...args) {
        // Invoke parent Group() constructor with our args
        super(...args);

        const dir = new SpotLight(0xffffff, 1.6, 7, 0.8, 1, 1);
        const ambi = new AmbientLight(0x404040, 0.32); // orig 1.32
        // kyColor : Integer, groundColor : Integer, intensity : Float
        const hemi = new HemisphereLight(0xffffff, 0x181830, 1.5);
        // var spotLightHelper = new SpotLightHelper( dir );
        // this.add( spotLightHelper );
        // dir.position.set(0, 1, 2);
        dir.position.set(0, 2, -7);
        dir.target.position.set(0, 0, 0);
        dir.castShadow = true;

        this.add(ambi, hemi, dir);
    }
}

export default BasicLights;
