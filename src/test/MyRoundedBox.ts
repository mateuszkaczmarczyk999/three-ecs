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

class RoundedBoxGeometry extends BoxGeometry {

	constructor( width = 1, height = 1, depth = 1, givenSegments = 2, radius = 0.1, scene: Scene ) {

		// ensure segments is odd so we have a plane connecting the rounded corners
		const segments = givenSegments * 2 + 1;

		// ensure radius isn't bigger than shortest side
		radius = Math.min( width / 2, height / 2, depth / 2, radius );

		super( 1, 1, 1, segments, segments, segments );

		// if we just have one segment we're the same as a regular box
		if ( segments === 1 ) return;

		const geometry2 = this.toNonIndexed();

		this.index = null;
		this.attributes.position = geometry2.attributes.position;
		this.attributes.normal = geometry2.attributes.normal;
		this.attributes.uv = geometry2.attributes.uv;

		const position = new Vector3();
		const normal = new Vector3();
        const boxNormal = new Vector3();

		const box = new Vector3( width/2 - radius, height/2, depth/2 - radius )

		const positions = this.attributes.position.array;
		const normals = this.attributes.normal.array;
		const uvs = this.attributes.uv.array;

		// const faceTris = positions.length / 6;
		// const faceDirVector = new Vector3();
		const halfSegmentSize = 0.5 / segments;
        const segmentSize = 1 / segments;
        const arcSegmentSize = radius / givenSegments;
        const arcSegmentCount = givenSegments;

        console.log('segments', segments);
        console.log('halfSegmentSize', halfSegmentSize);
        console.log('segmentSize', segmentSize);
        console.log('arcSegmentSize', arcSegmentSize);
        console.log('arcSegmentCount', arcSegmentCount);

        const pointGeometry = new SphereGeometry(0.01);

        for ( let i = 0, j = 0; i < positions.length; i += 3, j += 2 ) {
            position.fromArray( positions, i );
            boxNormal.fromArray( normals, i );

            // const mesh = new Mesh(pointGeometry, new MeshStandardMaterial({ color: 0xffffff }));
            // mesh.position.set(position.x, position.y, position.z);
            // scene.add(mesh);

        	normal.copy( position );

            const orderX = arcSegmentCount - Math.floor(Math.abs(normal.x) / segmentSize);
            const orderZ = arcSegmentCount - Math.floor(Math.abs(normal.z) / segmentSize);
            const orderY = arcSegmentCount - Math.floor(Math.abs(normal.y) / segmentSize);

            if (Math.sign( normal.x ) === 1 && orderZ === 0) {
                normal.x = width/2 - (orderX * arcSegmentSize);
            }
            if (Math.sign( normal.x ) === -1 && orderZ === 0) {
                normal.x = -width/2 + (orderX * arcSegmentSize);
            }
            if (Math.sign( normal.z ) === 1 && orderX === 0) {
                normal.z = depth/2 - (orderZ * arcSegmentSize);
            }
            if (Math.sign( normal.z ) === -1 && orderX === 0) {
                normal.z = -depth/2 + (orderZ * arcSegmentSize);
            }
            normal.y = 0;


            // if (boxNormal.y === 0) {
            //     // normal.x -= Math.sign( normal.x ) * halfSegmentSize;
            //     // normal.y = 0;
            //     // normal.z -= Math.sign( normal.z ) * halfSegmentSize;

            // } else {
            //     // normal.x -= Math.sign( normal.x ) * halfSegmentSize;
            //     // normal.y -= Math.sign( normal.y ) * halfSegmentSize;
            //     // normal.z -= Math.sign( normal.z ) * halfSegmentSize;
            //     // normal.y = 1;
            // }



            const mesh1 = new Mesh(pointGeometry, new MeshStandardMaterial({ color: 0x00ffff }));
            mesh1.position.set(normal.x, normal.y, normal.z);
            scene.add(mesh1);

            // normal.normalize();

            const mesh2 = new Mesh(pointGeometry, new MeshStandardMaterial({ color: 0x0000ff }));
            mesh2.position.set(normal.x * radius, normal.y * radius, normal.z * radius);
            scene.add(mesh2);

			positions[ i + 0 ] = normal.x;
			// positions[ i + 1 ] = normal.y;
			positions[ i + 2 ] = normal.z;

            // if (boxNormal.y === 0) {
            //     positions[ i + 0 ] = box.x * Math.sign( position.x ) + normal.x * radius;
            //     positions[ i + 1 ] = box.y * Math.sign( position.y ) + normal.y * radius;
            //     positions[ i + 2 ] = box.z * Math.sign( position.z ) + normal.z * radius;
            // } else {
            //     // normal.x = 0;
            //     // normal.y = Math.sign( normal.y ) * halfSegmentSize;
            //     // normal.z = 0;
            // }

            const mesh5 = new Mesh(pointGeometry, new MeshStandardMaterial({ color: 0xff00ff }));
            mesh5.position.set(positions[ i + 0 ], positions[ i + 1 ], positions[ i + 2 ]);
            scene.add(mesh5);

            // if (boxNormal.y === 0) {
            //     normals[ i + 0 ] = normal.x;
            //     normals[ i + 1 ] = normal.y;
            //     normals[ i + 2 ] = normal.z;
            // } else {
            //     normals[ i + 0 ] = normal.x;
            //     normals[ i + 1 ] = normal.y;
            //     normals[ i + 2 ] = normal.z;
            // }

            // console.log('normals', normals[ i + 0 ], normals[ i + 1 ], normals[ i + 2 ]);
        }

		// for ( let i = 0, j = 0; i < positions.length; i += 3, j += 2 ) {

		// 	position.fromArray( positions, i );
		// 	normal.copy( position );
		// 	normal.x -= Math.sign( normal.x ) * halfSegmentSize;
		// 	normal.y -= Math.sign( normal.y ) * halfSegmentSize;
		// 	normal.z -= Math.sign( normal.z ) * halfSegmentSize;
		// 	normal.normalize();

		// 	positions[ i + 0 ] = box.x * Math.sign( position.x ) + normal.x * radius;
		// 	positions[ i + 1 ] = box.y * Math.sign( position.y ) + normal.y * radius;
		// 	positions[ i + 2 ] = box.z * Math.sign( position.z ) + normal.z * radius;

		// 	normals[ i + 0 ] = normal.x;
		// 	normals[ i + 1 ] = normal.y;
		// 	normals[ i + 2 ] = normal.z;

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

export { RoundedBoxGeometry };