import {
	BoxGeometry,
	Mesh,
	MeshStandardMaterial,
	Scene,
	Sphere,
	SphereGeometry,
	Vector3
} from 'three';

const _tempNormal = new Vector3();

function getUv( faceDirVector: Vector3, normal: Vector3, uvAxis: 'x' | 'y' | 'z', projectionAxis: 'x' | 'y' | 'z', radius: number, sideLength: number ) {

	const totArcLength = 2 * Math.PI * radius / 4;

	// length of the planes between the arcs on each axis
	const centerLength = Math.max( sideLength - 2 * radius, 0 );
	const halfArc = Math.PI / 4;

	// Get the vector projected onto the Y plane
	_tempNormal.copy( normal );
	_tempNormal[ projectionAxis ] = 0;
	_tempNormal.normalize();

	// total amount of UV space alloted to a single arc
	const arcUvRatio = 0.5 * totArcLength / ( totArcLength + centerLength );

	// the distance along one arc the point is at
	const arcAngleRatio = 1.0 - ( _tempNormal.angleTo( faceDirVector ) / halfArc );

	if ( Math.sign( _tempNormal[ uvAxis ] ) === 1 ) {

		return arcAngleRatio * arcUvRatio;

	} else {

		// total amount of UV space alloted to the plane between the arcs
		const lenUv = centerLength / ( totArcLength + centerLength );
		return lenUv + arcUvRatio + arcUvRatio * ( 1.0 - arcAngleRatio );

	}

}

class MyRoundedBoxGeometry extends BoxGeometry {

	constructor( width = 1, height = 1, depth = 1, givenYSegments = 2, radiusY = 0.1, givenXZSegments = 2, radiusXZ = 0.1, scene: Scene ) {

		// ensure segments is odd so we have a plane connecting the rounded corners
		const segmentsY = givenYSegments * 2 + 1;
        const segmentsXZ = givenXZSegments * 2 + 1;

		// ensure radius isn't bigger than shortest side
		radiusY = Math.min( width / 2, height / 2, depth / 2, radiusY );
        radiusXZ = Math.min( width / 2, height / 2, depth / 2, radiusXZ );

		super( 1, 1, 1, segmentsY, segmentsXZ, 1 );

		// if we just have one segment we're the same as a regular box
		if ( segmentsY === 1 || segmentsXZ === 1) return;

		const geometry2 = this.toNonIndexed();

		this.index = null;
		this.attributes.position = geometry2.attributes.position;
		this.attributes.normal = geometry2.attributes.normal;
		this.attributes.uv = geometry2.attributes.uv;

		const position = new Vector3();
		const normal = new Vector3();
        const boxNormal = new Vector3();

		const positions = this.attributes.position.array;
		const normals = this.attributes.normal.array;
		const uvs = this.attributes.uv.array;

		// const faceTris = positions.length / 6;
		// const faceDirVector = new Vector3();
        const segmentYSize = 1 / segmentsY;
        const segmentXZSize = 1 / segmentsXZ;

        // const arcXZSegmentSize = radiusXZ / givenSegments;
        // const arcYSegmentSize = radiusY / givenSegments;
        const arcSegmentYCount = givenYSegments;
        const arcSegmentYAngle = Math.PI / 2 / arcSegmentYCount;

        const arcSegmentXZCount = givenXZSegments;
        const arcSegmentXZAngle = Math.PI / 2 / arcSegmentXZCount;

        const pointGeometry = new SphereGeometry(0.01);

        for ( let i = 0, j = 0; i < positions.length; i += 3, j += 2 ) {
            position.fromArray( positions, i );
            boxNormal.fromArray( normals, i );

            // const mesh = new Mesh(pointGeometry, new MeshStandardMaterial({ color: 0xffffff }));
            // mesh.position.set(position.x, position.y, position.z);
            // scene.add(mesh);

        	normal.copy( position );

            // console.log('arcSegmentCount', arcSegmentCount, "segments", segments);

            const orderX = arcSegmentYCount - Math.floor(Math.abs(normal.x) / segmentYSize);
            const orderZ = arcSegmentYCount - Math.floor(Math.abs(normal.z) / segmentYSize);

            const offsetFromAngleX = Math.cos(orderX * arcSegmentYAngle);
            const offsetFromAngleZ = Math.sin(orderX * arcSegmentYAngle);

            const offsetInX = (1-offsetFromAngleX) * radiusY;
            const offsetInZ = offsetFromAngleZ * radiusY - radiusY;


            if (Math.sign( normal.x ) === 1 && orderZ === 0) {
                normal.x = width/2 - offsetInX;
                if (Math.sign( normal.z ) === 1) normal.z = depth/2 + offsetInZ;
                if (Math.sign( normal.z ) === -1) normal.z = -depth/2 - offsetInZ;
            }
            if (Math.sign( normal.x ) === -1 && orderZ === 0) {
                normal.x = -width/2 + offsetInX;
                if (Math.sign( normal.z ) === 1) normal.z = depth/2 + offsetInZ;
                if (Math.sign( normal.z ) === -1) normal.z = -depth/2 - offsetInZ;
            }


            const orderY = arcSegmentXZCount - Math.floor(Math.abs(normal.y) / segmentXZSize);
            const offsetFromAngleY = Math.cos(orderY * arcSegmentXZAngle);
            const innerOffset = Math.cos((arcSegmentXZCount - orderY) * arcSegmentXZAngle) * radiusXZ/2 - radiusXZ/2;

            if (Math.sign( normal.y ) === 1) {
                normal.y = height/2 - (1-offsetFromAngleY) * radiusXZ;

                normal.x += Math.sign( normal.x ) * innerOffset;
                normal.z += Math.sign( normal.z ) * innerOffset;

            }
            if (Math.sign( normal.y ) === -1) {
                normal.y = -height/2 + (1-offsetFromAngleY) * radiusXZ;

                normal.x += Math.sign( normal.x ) * innerOffset;
                normal.z += Math.sign( normal.z ) * innerOffset;
            }

            // normal.normalize();

            // const mesh1 = new Mesh(pointGeometry, new MeshStandardMaterial({ color: 0x00ffff }));
            // mesh1.position.set(normal.x, normal.y, normal.z);
            // scene.add(mesh1);

            // const mesh2 = new Mesh(pointGeometry, new MeshStandardMaterial({ color: 0x0000ff }));
            // mesh2.position.set(normal.x * radius, normal.y * radius, normal.z * radius);
            // scene.add(mesh2);

			positions[ i + 0 ] = normal.x;
			positions[ i + 1 ] = normal.y;
			positions[ i + 2 ] = normal.z;

            this.computeVertexNormals();

            // const mesh5 = new Mesh(pointGeometry, new MeshStandardMaterial({ color: 0xff00ff }));
            // mesh5.position.set(positions[ i + 0 ], positions[ i + 1 ], positions[ i + 2 ]);
            // scene.add(mesh5);
        }

		// 	const side = Math.floor( i / faceTris );

		// 	switch ( side ) {

		// 		case 0: // right

		// 			// generate UVs along Z then Y
		// 			faceDirVector.set( 1, 0, 0 );
		// 			uvs[ j + 0 ] = getUv( faceDirVector, normal, 'z', 'y', radius, depth );
		// 			uvs[ j + 1 ] = 1.0 - getUv( faceDirVector, normal, 'y', 'z', radius, height );
		// 			break;

		// 		case 1: // left

		// 			// generate UVs along Z then Y
		// 			faceDirVector.set( - 1, 0, 0 );
		// 			uvs[ j + 0 ] = 1.0 - getUv( faceDirVector, normal, 'z', 'y', radius, depth );
		// 			uvs[ j + 1 ] = 1.0 - getUv( faceDirVector, normal, 'y', 'z', radius, height );
		// 			break;

		// 		case 2: // top

		// 			// generate UVs along X then Z
		// 			faceDirVector.set( 0, 1, 0 );
		// 			uvs[ j + 0 ] = 1.0 - getUv( faceDirVector, normal, 'x', 'z', radius, width );
		// 			uvs[ j + 1 ] = getUv( faceDirVector, normal, 'z', 'x', radius, depth );
		// 			break;

		// 		case 3: // bottom

		// 			// generate UVs along X then Z
		// 			faceDirVector.set( 0, - 1, 0 );
		// 			uvs[ j + 0 ] = 1.0 - getUv( faceDirVector, normal, 'x', 'z', radius, width );
		// 			uvs[ j + 1 ] = 1.0 - getUv( faceDirVector, normal, 'z', 'x', radius, depth );
		// 			break;

		// 		case 4: // front

		// 			// generate UVs along X then Y
		// 			faceDirVector.set( 0, 0, 1 );
		// 			uvs[ j + 0 ] = 1.0 - getUv( faceDirVector, normal, 'x', 'y', radius, width );
		// 			uvs[ j + 1 ] = 1.0 - getUv( faceDirVector, normal, 'y', 'x', radius, height );
		// 			break;

		// 		case 5: // back

		// 			// generate UVs along X then Y
		// 			faceDirVector.set( 0, 0, - 1 );
		// 			uvs[ j + 0 ] = getUv( faceDirVector, normal, 'x', 'y', radius, width );
		// 			uvs[ j + 1 ] = 1.0 - getUv( faceDirVector, normal, 'y', 'x', radius, height );
		// 			break;

		// 	}

		// }

	}

}

export { MyRoundedBoxGeometry };