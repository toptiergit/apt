var scene;
var camera;
var renderer;
var controls;
var viewModel;
var itemMaterial;

async function PackContainers(request) {
	return $.ajax({
		url: BaseUrl + 'Api/ContainerPackingApi',
		type: 'POST',
		data: request,
		contentType: 'application/json; charset=utf-8'
	});
};

function InitializeDrawing() {
    try {
        var container = $('#drawing-container');

        scene = new THREE.Scene();
        //camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.lookAt(scene.position);

        //var axisHelper = new THREE.AxisHelper( 5 );
        //scene.add( axisHelper );

        // LIGHT
        var light = new THREE.PointLight(0xffffff);
        light.position.set(0, 150, 100);
        scene.add(light);

        // Get the item stuff ready.
        itemMaterial = new THREE.MeshNormalMaterial({ canvas: container, transparent: true, opacity: 0.6 });

        renderer = new THREE.WebGLRenderer({ antialias: true }); // WebGLRenderer CanvasRenderer
        renderer.setClearColor(0xf0f0f0);
        renderer.setPixelRatio(window.devicePixelRatio);
        //renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
        renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);                
        //renderer.autoResize = true;
        container.append(renderer.domElement);

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        window.addEventListener('resize', onWindowResize, false);

        animate();
    } catch (error) {
        console.error("Error : " + error);
    }
};

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	//renderer.setSize( window.innerWidth / 2, window.innerHeight / 2 );
	renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
}

function animate() {
    try {
	    requestAnimationFrame( animate );
	    controls.update();
        render();
    } catch (error) {
        console.error("Error : " + error);
    }
}
function render() {
	renderer.render( scene, camera );
}

var ViewModel = function () {
	var self = this;

	self.ItemCounter = 0;
	self.ContainerCounter = 0;

	self.ItemsToRender = ko.observableArray([]);
	self.LastItemRenderedIndex = ko.observable(-1);

	self.ContainerOriginOffset = {
		x: 0,
		y: 0,
		z: 0
	};

	self.AlgorithmsToUse = ko.observableArray([]);
	self.ItemsToPack = ko.observableArray([]);
	self.Containers = ko.observableArray([]);

	self.NewItemToPack = ko.mapping.fromJS(new ItemToPack());
	self.NewContainer = ko.mapping.fromJS(new Container());

    self.GenerateItemsToPack = function () {
        self.ItemsToPack([]);
        self.ItemsToPack.push(ko.mapping.fromJS({ ID: 1000, Name: '12x12x12', Length: 12, Width: 12, Height: 12, Quantity: 10 }));
        self.ItemsToPack.push(ko.mapping.fromJS({ ID: 1001, Name: '16x16x16', Length: 16, Width: 16, Height: 16, Quantity: 10 }));
        self.ItemsToPack.push(ko.mapping.fromJS({ ID: 1002, Name: '18x18x18', Length: 18, Width: 18, Height: 18, Quantity: 10 }));
        self.ItemsToPack.push(ko.mapping.fromJS({ ID: 1003, Name: '22x22x22', Length: 22, Width: 22, Height: 22, Quantity: 10 }));
        self.ItemsToPack.push(ko.mapping.fromJS({ ID: 1004, Name: '24x24x24', Length: 24, Width: 24, Height: 24, Quantity: 10 }));
    };
	
	self.GenerateContainers = function () {
		self.Containers([]);
        self.Containers.push(ko.mapping.fromJS({ ID: 1000, Name: '1016 x 1219', Length: 40, Width: 48, Height: 50, AlgorithmPackingResults: [] }));
        self.Containers.push(ko.mapping.fromJS({ ID: 1001, Name: '1000 x 1200', Length: 39.37, Width: 47.24, Height: 50, AlgorithmPackingResults: [] }));
        self.Containers.push(ko.mapping.fromJS({ ID: 1002, Name: '1165 x 1165', Length: 45.9, Width: 45.9, Height: 50, AlgorithmPackingResults: [] }));
        self.Containers.push(ko.mapping.fromJS({ ID: 1003, Name: '1067 x 1067', Length: 42, Width: 42, Height: 50, AlgorithmPackingResults: [] }));
        self.Containers.push(ko.mapping.fromJS({ ID: 1004, Name: '800 x 1200', Length: 31.50, Width: 47.24, Height: 50, AlgorithmPackingResults: [] }));
	};

	self.AddAlgorithmToUse = function () {
		var algorithmID = $('#algorithm-select option:selected').val();
		var algorithmName = $('#algorithm-select option:selected').text();
		self.AlgorithmsToUse.push({ AlgorithmID: algorithmID, AlgorithmName: algorithmName });
	};

    self.RemoveAlgorithmToUse = function (item) {
		self.AlgorithmsToUse.remove(item);
	};

	self.AddNewItemToPack = function () {
		self.NewItemToPack.ID(self.ItemCounter++);
		self.ItemsToPack.push(ko.mapping.fromJS(ko.mapping.toJS(self.NewItemToPack)));
		self.NewItemToPack.Name('');
		self.NewItemToPack.Length('');
		self.NewItemToPack.Width('');
		self.NewItemToPack.Height('');
		self.NewItemToPack.Quantity('');
	};

	self.RemoveItemToPack = function (item) {
		self.ItemsToPack.remove(item);
	};

	self.AddNewContainer = function () {
		self.NewContainer.ID(self.ContainerCounter++);
		self.Containers.push(ko.mapping.fromJS(ko.mapping.toJS(self.NewContainer)));
		self.NewContainer.Name('');
		self.NewContainer.Length('');
		self.NewContainer.Width('');
		self.NewContainer.Height('');
	};

	self.RemoveContainer = function (item) {
		self.Containers.remove(item);
	};

    self.PackContainers = function (LocationId) {
        
        $('body').show();
        $overlay.fadeIn();

        NProgress.configure({ parent: "body" });
        NProgress.configure({ showSpinner: true });
        NProgress.start();			
        //console.log("LocationId : " + LocationId);

        // Add Algorithm. ----------------------------------------------------------------        
        self.AlgorithmsToUse().forEach(algorithm => {
            if (algorithm.AlgorithmID != null) self.RemoveAlgorithmToUse(algorithm);
        });

        // Set AlgorithmsToUse data.
        var AlgorithmObj = { AlgorithmID: 1, AlgorithmName: "EB-AFIT" };
        self.AlgorithmsToUse.push(AlgorithmObj);

        // Add AlgorithmsToUse to array data.
        var algorithmsToUse = [];
        self.AlgorithmsToUse().forEach(algorithm => {
            algorithmsToUse.push(algorithm.AlgorithmID);
        });
        //console.log("AlgorithmID : " + algorithmsToUse);

        // Add items to pack. -----------------------------------------------------------
        self.ItemsToPack().forEach(itemToPack => {
            //console.log(itemToPack);
            if (itemToPack.ID != null) self.RemoveItemToPack(itemToPack);
        });

        // Set ItemsToPack data.
        var RowIndex = 0;
        var itemsToPack = [];
        var tempItemsToPack = [];
        $.each($(".tagRowTdClass" + LocationId), function () {
            //console.log($(this).attr('name') + ":" + $(this).val());
            RowIndex++;
            tempItemsToPack.push($(this).val());
            if (RowIndex == 6) {
                var itemToPack = {
                    ID: tempItemsToPack[0],
                    Dim1: tempItemsToPack[3],
                    Dim2: tempItemsToPack[2],
                    Dim3: tempItemsToPack[4],
                    Quantity: tempItemsToPack[5]
                };
                itemsToPack.push(itemToPack);

                //console.log(tempItemsToPack);
                tempItemsToPack = [];
                RowIndex = 0;
            }                                                      
        });
        //console.log(itemsToPack);

        // Add containerToUse. ----------------------------------------------------------
        self.Containers().forEach(container => {
            //console.log(container);
            if (container.ID != null) self.RemoveContainer(container);
        });

        // Set ItemsToPack data.
        var containers = [];
        var tempContainers = [];
        $.each($(".LocRowTdClass" + LocationId), function () {
            //console.log($(this).attr('name') + ":" + $(this).val());
            RowIndex++;
            tempContainers.push($(this).val());
            if (RowIndex == 5) {
                var containerToUse = {
                    ID: tempContainers[0],
                    Length: tempContainers[3],
                    Width: tempContainers[2],
                    Height: tempContainers[4]
                };
                containers.push(containerToUse)

                //console.log(tempContainers);
                tempContainers = [];
                RowIndex = 0;
            }
        });
        //console.log(containers);

        //Build container packing request.
        var request = {
            Containers: containers,
            ItemsToPack: itemsToPack,
            AlgorithmTypeIDs: algorithmsToUse
        };
        //console.log(JSON.stringify(request));

        PackContainers(JSON.stringify(request))
            .then(response => {
                //console.log(response);
                // Tie this response back to the correct containers.
                response.forEach(containerPackingResult => {
                    console.log(containerPackingResult);
                    
                    $("#PercentContainerVolumePacked" + LocationId).empty().append(containerPackingResult.AlgorithmPackingResults[0].PercentContainerVolumePacked);
                    $("#PackedItems" + LocationId).empty().append(containerPackingResult.AlgorithmPackingResults[0].PackedItems.length);
                    $("#UnpackedItems" + LocationId).empty().append(containerPackingResult.AlgorithmPackingResults[0].UnpackedItems.length);
                    $("#AlgorithmPackingResults" + LocationId).show();

                    $('#AlgorithmPackingResults' + LocationId).bind("click", function (event) {
                        //console.log(LocationId);
                        self.ShowPackingViewAppDev(containerPackingResult, containers[0]); 
                    });

                    $('#UnpackItemInRenderId').unbind("click");
                    $('#UnpackItemInRenderId').bind("click", function (event) {                     
                        if (self.LastItemRenderedIndex() > -1) {
                            self.UnpackItemInRender();
                            event.preventDefault();
                        } else {
                            event.stopPropagation();
                        }
                    });

                    $('#PackItemInRenderId').unbind("click");
                    $('#PackItemInRenderId').bind("click", function (event) {
                        if (self.ItemsToRender().length === self.LastItemRenderedIndex() + 1) {
                            event.stopPropagation();
                        } else {
                            self.PackItemInRender();
                            event.preventDefault();
                        }
                    }); // response
                });  // .then
            });

        NProgress.done();
        $overlay.fadeOut();
    };

    self.ShowPackingViewAppDev = function (algorithmPackingResult, container) {
        try {
            var selectedObject = scene.getObjectByName('container');
            scene.remove(selectedObject);

            for (var i = 0; i < 1000; i++) {
                var selectedObject = scene.getObjectByName('cube' + i);
                scene.remove(selectedObject);
            }

            camera.position.set(parseInt(container.Length), parseInt(container.Length), parseInt(container.Length));
        
            self.ItemsToRender(algorithmPackingResult.AlgorithmPackingResults[0].PackedItems);
            self.LastItemRenderedIndex(-1);
        
            self.ContainerOriginOffset.x = -1 * parseInt(container.Length) / 2;
            self.ContainerOriginOffset.y = -1 * parseInt(container.Height) / 2;
            self.ContainerOriginOffset.z = -1 * parseInt(container.Width) / 2;

            var geometry = new THREE.BoxGeometry(parseInt(container.Length), parseInt(container.Height), parseInt(container.Width));
            var geo = new THREE.EdgesGeometry(geometry); // or WireframeGeometry( geometry )
            var mat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
            var wireframe = new THREE.LineSegments(geo, mat);
            wireframe.position.set(0, 0, 0);
            wireframe.name = 'container';
            scene.add(wireframe);
        } catch (error) {
            console.error("Error : " + error);
        }
    };

    self.ShowPackingView = function (algorithmPackingResult) {
        try {
            //console.log(algorithmPackingResult);

		    var container = this;
		    var selectedObject = scene.getObjectByName('container');
		    scene.remove( selectedObject );
		
		    for (var i = 0; i < 1000; i++) {
			    var selectedObject = scene.getObjectByName('cube' + i);
			    scene.remove(selectedObject);
		    }
		
		    camera.position.set(container.Length(), container.Length(), container.Length());

		    self.ItemsToRender(algorithmPackingResult.PackedItems);
		    self.LastItemRenderedIndex(-1);

		    self.ContainerOriginOffset.x = -1 * container.Length() / 2;
		    self.ContainerOriginOffset.y = -1 * container.Height() / 2;
		    self.ContainerOriginOffset.z = -1 * container.Width() / 2;

		    var geometry = new THREE.BoxGeometry(container.Length(), container.Height(), container.Width());
		    var geo = new THREE.EdgesGeometry( geometry ); // or WireframeGeometry( geometry )
		    var mat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } );
		    var wireframe = new THREE.LineSegments( geo, mat );
		    wireframe.position.set(0, 0, 0);
		    wireframe.name = 'container';
            scene.add(wireframe);
        } catch (error) {
            console.error("Error : " + error);
        }
	};

	self.AreItemsPacked = function () {
		if (self.LastItemRenderedIndex() > -1) {
			return true;
		}

		return false;
	};

	self.AreAllItemsPacked = function () {
		if (self.ItemsToRender().length === self.LastItemRenderedIndex() + 1) {
			return true;
		}

		return false;
	};

    self.PackItemInRender = function () {
        try {
            var itemIndex = self.LastItemRenderedIndex() + 1;

            var itemOriginOffset = {
                x: self.ItemsToRender()[itemIndex].PackDimX / 2,
                y: self.ItemsToRender()[itemIndex].PackDimY / 2,
                z: self.ItemsToRender()[itemIndex].PackDimZ / 2
            };

            var itemGeometry = new THREE.BoxGeometry(self.ItemsToRender()[itemIndex].PackDimX, self.ItemsToRender()[itemIndex].PackDimY, self.ItemsToRender()[itemIndex].PackDimZ);
            var cube = new THREE.Mesh(itemGeometry, itemMaterial);
            cube.position.set(self.ContainerOriginOffset.x + itemOriginOffset.x + self.ItemsToRender()[itemIndex].CoordX, self.ContainerOriginOffset.y + itemOriginOffset.y + self.ItemsToRender()[itemIndex].CoordY, self.ContainerOriginOffset.z + itemOriginOffset.z + self.ItemsToRender()[itemIndex].CoordZ);
            cube.name = 'cube' + itemIndex;
            scene.add(cube);

            self.LastItemRenderedIndex(itemIndex);
        } catch (error) {
            console.error("Error : " + error);
        }
	};

    self.UnpackItemInRender = function () {
		var selectedObject = scene.getObjectByName('cube' + self.LastItemRenderedIndex());
		scene.remove( selectedObject );
		self.LastItemRenderedIndex(self.LastItemRenderedIndex() - 1);
	};
};

var ItemToPack = function () {
	this.ID = '';
	this.Name = '';
	this.Length = '';
	this.Width = '';
	this.Height = '',
	this.Quantity = '';
}

var Container = function () {
	this.ID = '';
	this.Name = '';
	this.Length = '';
	this.Width = '';
	this.Height = '';
	this.AlgorithmPackingResults = [];
}

$(document).ready(() => {
    try {
        $('[data-toggle="tooltip"]').tooltip();
        InitializeDrawing();

        viewModel = new ViewModel();
        ko.applyBindings(viewModel);
    } catch (error) {
        console.error("Error : " + error);
    }
});