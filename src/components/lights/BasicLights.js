import { Group, SpotLight, AmbientLight, HemisphereLight, SpotLightHelper } from 'three';

class BasicLights extends Group {
    constructor(...args) {
        // Invoke parent Group() constructor with our args
        super(...args);

        const dir = new SpotLight(0xffffff, 1.6, 7, 0.8, 1, 1);
        const ambi = new AmbientLight(0x404040, 0.32); // orig 1.32
        const hemi = new HemisphereLight(0xffffff, 0x555555, 1.3);
        dir.position.set(3, 2, -7);
        dir.target.position.set(0, 0, 0);

        const dir1 = new SpotLight(0xffffff, 1.6, 7, 0.8, 1, 1);
        dir1.position.set(-3, 3, -8);
        dir1.target.position.set(0, 0, 0);


        this.add(ambi, hemi, dir, dir1);
    }
}

export default BasicLights;
