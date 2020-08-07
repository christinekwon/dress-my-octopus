// import { Geometry } from '../core/Geometry.js';
// import { BufferGeometry } from '../core/BufferGeometry.js';
// import { Float32BufferAttribute } from '../core/BufferAttribute.js';
// import { Vector2 } from '../math/Vector2.js';
// import { Vector3 } from '../math/Vector3.js';
import { Group, Scene } from "three";

import * as THREE from "three";

// TubeGeometry

class NewTubeBufferGeometry extends Group {
    constructor( path, tubularSegments, radius, radialSegments, closed ) {
        super();
        // THREE.BufferGeometry.call( this );

        this.type = 'NewTubeBufferGeometry';
    
        this.state = {
            path: path,
            tubularSegments: tubularSegments,
            radius: radius,
            radialSegments: radialSegments,
            closed: closed
        };
        
        this.path = path;
        

	this.tubularSegments = tubularSegments;
	this.radius = radius;
	this.radialSegments = radialSegments;
	this.closed = closed;

	this.frames = path.computeFrenetFrames( tubularSegments, closed );

	// expose internals

	this.tangents = frames.tangents;
	this.normals = frames.normals;
	this.binormals = frames.binormals;

    // console.log(this.path);
	// helper variables

	this.vertex = new THREE.Vector3();
	this.normal = new THREE.Vector3();
	this.uv = new THREE.Vector2();
	this.P = new THREE.Vector3();

	// buffer

	this.vertices = [];
	this.normals = [];
	this.uvs = [];
	this.indices = [];

	// create buffer data

	this.generateBufferData();

	// build geometry

	// setIndex( this.indices );
	// this.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
	// this.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );
	// this.setAttribute( 'uv', new THREE.Float32BufferAttribute( uvs, 2 ) );

    
}

	// functions

	generateBufferData() {

		for ( let i = 0; i < this.tubularSegments; i ++ ) {

			this.generateSegment( i );

		}

		// if the geometry is not closed, generate the last row of vertices and normals
		// at the regular position on the given path
		//
		// if the geometry is closed, duplicate the first row of vertices and normals (uvs will differ)

		this.generateSegment( ( closed === false ) ? this.tubularSegments : 0 );

		// uvs are generated in a separate function.
		// this makes it easy compute correct values for closed geometries

		this.generateUVs();

		// finally create faces

		this.generateIndices();

	}

	generateSegment( i ) {

		// we use getPointAt to sample evenly distributed points from the given path

		this.P = this.path.getPointAt( i / this.tubularSegments, this.P );

		// retrieve corresponding normal and binormal

		const N = this.frames.normals[ i ];
		const B = this.frames.binormals[ i ];

		// generate normals and vertices for the current segment

		for ( let j = 0; j <= this.radialSegments; j ++ ) {

			const v = j / this.radialSegments * Math.PI * 2;

			const sin = Math.sin( v );
			const cos = - Math.cos( v );

			// normal

			this.normal.x = ( cos * N.x + sin * B.x );
			this.normal.y = ( cos * N.y + sin * B.y );
			this.normal.z = ( cos * N.z + sin * B.z );
			this.normal.normalize();

			this.normals.push( this.normal.x, this.normal.y, this.normal.z );

			// vertex

			this.vertex.x = this.P.x + this.radius * this.normal.x;
			this.vertex.y = this.P.y + this.radius * this.normal.y;
			this.vertex.z = this.P.z + this.radius * this.normal.z;

			this.vertices.push( this.vertex.x, this.vertex.y, this.vertex.z );

		}

	}

	generateIndices() {

		for ( let j = 1; j <= this.tubularSegments; j ++ ) {

			for ( let i = 1; i <= this.radialSegments; i ++ ) {

				const a = ( this.radialSegments + 1 ) * ( j - 1 ) + ( i - 1 );
				const b = ( this.radialSegments + 1 ) * j + ( i - 1 );
				const c = ( this.radialSegments + 1 ) * j + i;
				const d = ( this.radialSegments + 1 ) * ( j - 1 ) + i;

				// faces

				this.indices.push( a, b, d );
				this.indices.push( b, c, d );

			}

		}

	}

	generateUVs() {

        var numpoints = this.tubularSegments;
    this.grid = [];
    for (let i = 0; i < numpoints; i++) {
        this.grid[i] = [];

        let u = i / (numpoints - 1);

        pos = path.getPointAt(u); 
        var posRadius = this.radius[Math.floor((this.radius.length - 1) * u)];

        tangent = tangents[i];
        normal = normals[i];
        binormal = binormals[i];

        for (j = 0; j < this.radialSegments; j++) {

            v = j / this.radialSegments * 2 * Math.PI;
            // TODO: Hack: Negating it so it faces outside.
            cx = -posRadius * Math.cos(v); 
            cy = posRadius * Math.sin(v);

            pos2.copy(pos);
            pos2.x += cx * normal.x + cy * binormal.x;
            pos2.y += cx * normal.y + cy * binormal.y;
            pos2.z += cx * normal.z + cy * binormal.z;

            this.grid[i][j] = vert(pos2.x, pos2.y, pos2.z);

        }
    }

		// for ( let i = 0; i <= this.tubularSegments; i ++ ) {

		// 	for ( let j = 0; j <= this.radialSegments; j ++ ) {

		// 		this.uv.x = i / this.tubularSegments;
		// 		this.uv.y = j / this.radialSegments;

		// 		this.uvs.push( this.uv.x, this.uv.y );

		// 	}

		// }

	}

//     THREE.NewTubeBufferGeometry.prototype = Object.create( BufferGeometry.prototype );
// NewTubeBufferGeometry.prototype.constructor = NewTubeBufferGeometry;

// NewTubeBufferGeometry.prototype.toJSON = function () {

// 	const data = BufferGeometry.prototype.toJSON.call( this );

// 	data.path = this.parameters.path.toJSON();

// 	return data;


}

export default NewTubeBufferGeometry;