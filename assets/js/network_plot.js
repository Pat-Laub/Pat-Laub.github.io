
var network;
// var container;
// var exportArea;
// var importButton;
// var exportButton;

window.onload = function init() {

    network = new vis.Network( document.getElementById('network'), {}, {interaction:{hover:true}});


    // Add options to the dropdown selector
    var sel = document.getElementById("newResearchGroup");
    for (const groupName in newResearchGroups) {
        // create new option element
        var opt = document.createElement("option");

        // create text node to add to option element (opt)
        opt.appendChild( document.createTextNode(groupName) );

        // set value property of opt
        opt.value = groupName;

        // add opt to end of select box (sel)
        sel.appendChild(opt);
    }


    draw();
}


var members = {
	"Caroline BAYART": { "x": 421, "y": -163, "id": 1, "FoR": "Management Sciences" },
	"Alexis BIENVENÜE": { "x": -176, "y": -217, "id": 2, "FoR": "Applied Mathematics" },
	"Jean-François BOULIER": { "x": -444, "y": 224, "id": 3, "FoR": "Management Sciences" },
	"Valérie BUTHION": { "x": -370, "y": -419, "id": 4, "FoR": "Management Sciences" },
	"Caroline CHAMPAGNE": { "x": 155, "y": -495, "id": 5, "FoR": "Management Sciences" },
	"Denis CLOT": { "x": -161, "y": -355, "id": 6, "FoR": "Computer Science" },
	"Aurélien COULOUMY": { "x": -140, "y": -503, "id": 7, "FoR": "Management Sciences" },
	"Christian DE PERETTI": { "x": -358, "y": -240, "id": 8, "FoR": "Economics" },
	"Diana DOROBANTU": { "x": -174, "y": 12, "id": 9, "FoR": "Applied Mathematics" },
	"Anne EYRAUD-LOISEL": { "x": 245, "y": -11, "id": 10, "FoR": "Applied Mathematics" },
	"Pierre-Olivier GOFFARD": { "x": 117, "y": 307, "id": 11, "FoR": "Applied Mathematics" },
	"Nathalie HAVET": { "x": 336, "y": -260, "id": 12, "FoR": "Economics" },
	"Ying JIAO": { "x": -10, "y": -282, "id": 13, "FoR": "Applied Mathematics" },
	"Nabil KAZI-TANI": { "x": -560, "y": 6, "id": 14, "FoR": "Applied Mathematics" },
	"Agnès LANCINI": { "x": 500, "y": -383, "id": 15, "FoR": "Management Sciences" },
	"Nicolas LEBOISNE": { "x": 229, "y": 158, "id": 16, "FoR": "Management Sciences" },
	"Charlotte LÉCUYER": { "x": 146, "y": -206, "id": 17, "FoR": "Management Sciences" },
	"Stéphane LOISEL": { "x": 73, "y": 115, "id": 18, "FoR": "Applied Mathematics" },
	"Xavier MILHAUD": { "x": -211, "y": 107, "id": 19, "FoR": "Applied Mathematics" },
	"Frédéric PLANCHET": { "x": 105, "y": -28, "id": 20, "FoR": "Management Sciences" },
	"Christian ROBERT": { "x": -54, "y": -159, "id": 21, "FoR": "Applied Mathematics" },
	"Didier RULLIÈRE": { "x": -533, "y": -117, "id": 22, "FoR": "Management Sciences" },
	"Jean-Louis RULLIÈRE": { "x": 256, "y": -362, "id": 23, "FoR": "Economics" },
	"Séverine SALEILLES": { "x": -370, "y": 16, "id": 24, "FoR": "Management Sciences" },
	"Melchior SALGADO": { "x": -304, "y": 350, "id": 25, "FoR": "Management Sciences" },
	"Yahia SALHI": { "x": -88, "y": 133, "id": 26, "FoR": "Applied Mathematics" },
	"Pierre-E. THÉROND": { "x": -47, "y": -3, "id": 27, "FoR": "Management Sciences" },
	"Linh TRAN DIEU": { "x": 35, "y": -420, "id": 28, "FoR": "Management Sciences" },
	"Catherine VIOT": { "x": -100, "y": 400, "id": 29, "FoR": "Management Sciences" },
	"Denys POMMERET": { "x": 400, "y": 300, "id": 30, "FoR": "Applied Mathematics" }
};

// var moveUp = [2, 21, 13, 9, 27, 20, 10, 19, 26, 18];
// for (var name in members) {
//          	if (moveUp.includes(members[name].id)) {
//          		members[name].y -= 50;
//          		console.log(name + ": ", members[name].y)
//          	}
//          }


// Field of research colours
var FORColours = {
    "Economics": "rgb(163, 122, 76)",
    "Management Sciences": "rgb(183, 135, 177)",
    "Applied Mathematics": "rgb(250, 167, 71)",
    "Computer Science": "rgb(246, 143, 85)"
};

// Research group colours

var researchGroupColours = {
    "Actuariat Durable": "rgb(81, 157, 209)",
    "Chaire DAMI": "rgb(2, 144, 94)",
    "Lolita": "rgb(253, 106, 107)",
    "Prevent'Horizon": "rgb(28, 66, 111)",
    "Reference Value": "rgb(113, 113, 185)"
};

var researchGroups = {
	"Actuariat Durable": ["Anne EYRAUD-LOISEL", "Stéphane LOISEL", "Christian ROBERT"],
	"Chaire DAMI": ["Alexis BIENVENÜE", "Aurélien COULOUMY", "Nabil KAZI-TANI", "Stéphane LOISEL", "Xavier MILHAUD", "Frédéric PLANCHET", "Christian ROBERT", "Didier RULLIÈRE", "Yahia SALHI", "Pierre-E. THÉROND"],
	"Lolita": ["Alexis BIENVENÜE", "Diana DOROBANTU", "Anne EYRAUD-LOISEL", "Stéphane LOISEL", "Xavier MILHAUD", "Frédéric PLANCHET", "Christian ROBERT", "Didier RULLIÈRE", "Yahia SALHI"],
	"Prevent'Horizon": ["Nathalie HAVET", "Nabil KAZI-TANI", "Jean-Louis RULLIÈRE"],
	"Reference Value": ["Caroline BAYART", "Christian ROBERT", "Melchior SALGADO"]
};

for (var name in members) {
	members[name].researchGroups = [];
}

for (var groupName in researchGroups) {
    for (const name of researchGroups[groupName]) {
    	if (members.hasOwnProperty(name)) {
    		members[name].researchGroups.push(groupName);
    	} else {
    		console.log("Name '" + name + "' in research group '" + groupName + "' isn't of an ISFA member")
    	}

	}
}

// Co-authorship information
var fromEnds = [1, 2, 9, 9, 10, 10, 11, 12, 13, 14, 16, 18, 18, 18, 19, 19, 20, 21, 26, 30, 30, 30];
var toEnds = [12, 21, 26, 27, 16, 20, 18, 23, 21, 22, 18, 20, 26, 27, 26, 27, 27, 27, 27, 11, 18, 26];
var numberPapers = [1, 2, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 5, 1, 1, 1];


// ---- Forecasted projects ----


var newResearchGroups = {
	// These were in 1st email from Stéphane
	"CNP DiALog": ["Anne EYRAUD-LOISEL", "Pierre-Olivier GOFFARD", "Xavier MILHAUD", "Denys POMMERET"],
	"MAIF": ["Caroline BAYART", "Denis CLOT", "Nathalie HAVET", "Charlotte LÉCUYER", "Denys POMMERET", "Jean-Louis RULLIÈRE", "Melchior SALGADO"],
	"ALFA (Fraude)": ["Caroline BAYART", "Diana DOROBANTU", "Anne EYRAUD-LOISEL", "Charlotte LÉCUYER", "Jean-Louis RULLIÈRE", "Catherine VIOT"],
	"Critères ESG et finance verte": ["Jean-François BOULIER", "Caroline CHAMPAGNE", "Aurélien COULOUMY", "Charlotte LÉCUYER", "Christian ROBERT", "Séverine SALEILLES", "Pierre-E. THÉROND"],

	// These were in 2nd email from Stéphane
	"Actuariat et santé": ["Valérie BUTHION", "Xavier MILHAUD", "Yahia SALHI", "Pierre-Olivier GOFFARD", "Nathalie HAVET", "Jean-Louis RULLIÈRE", "Denys POMMERET", "Stéphane LOISEL", "Frédéric PLANCHET", "Alexis BIENVENÜE"],
	"Blockchain et crypto-assets": ["Nicolas LEBOISNE", "Pierre-Olivier GOFFARD", "Anne EYRAUD-LOISEL", "Stéphane LOISEL"],

	// These were "future projects" specified earlier, possible duplicates with above
	"APRIL": ["Caroline BAYART", "Denis CLOT", "Charlotte LÉCUYER"],
	"ISR": ["Jean-François BOULIER", "Caroline CHAMPAGNE", "Aurélien COULOUMY", "Charlotte LÉCUYER"],
	"MDS": ["Pierre-Olivier GOFFARD", "Christian ROBERT", "Nathalie HAVET"]
};


var newResearchGroupColours = {
        "CNP DiALog": "0000ff",
        "MAIF": "0000ff",
        "ALFA (Fraude)": "0000ff",
        "Critères ESG et finance verte": "0000ff",
        "Actuariat et santé": "0000ff",
        "Blockchain et crypto-assets": "0000ff",
        "APRIL": "0000ff",
        "ISR": "0000ff",
        "MDS": "0000ff"
};



for (var name in members) {
	members[name].newResearchGroups = [];
}

for (var groupName in newResearchGroups) {
    for (const name of newResearchGroups[groupName]) {
    	if (members.hasOwnProperty(name)) {
    		members[name].newResearchGroups.push(groupName);
    	} else {
    		console.log("Name '" + name + "' in research group '" + groupName + "' isn't of an ISFA member")
    	}
	}
}

// Print out all the research group memberships
for (var name in members) {
	if (members[name].researchGroups.length > 0) {
		console.log(name + " has memberships in " + String(members[name].researchGroups));
	} else {
		console.log(name + " not in any research groups");
	}

	if (members[name].newResearchGroups.length > 0) {
		console.log(name + " has new memberships in " + String(members[name].newResearchGroups));
	} else {
		console.log(name + " not in any new research groups");
	}
}




function draw() {

    var nodes = [];
    var edges = [];

    for (var name in members) {
    	var member = members[name]

    	nodes.push({
              id: member.id,
              title: name,
              color: FORColours[member.FoR],
              x: member.x,
              y: member.y,
              fixed: false,
              physics: true
        });
    }


    for (var j = 0; j < fromEnds.length; j++) {
    	var title = "";
    	if (numberPapers[j] > 1) {
    		title = String(numberPapers[j]) + ' papers together';
    	} else {
    		title = String(numberPapers[j]) + ' paper together';
    	}

        edges.push({
            from: fromEnds[j],
            to: toEnds[j],
            value: numberPapers[j],
            title: title
          });
    }

    groupToLinkName = document.getElementById("newResearchGroup").value;
    console.log("Selected to draw new research group: " + groupToLinkName);

    if (groupToLinkName != "None") {
    	for (const groupName in newResearchGroups) {
    		if (groupToLinkName == "All" || groupName == groupToLinkName) {

    			groupToLink = newResearchGroups[groupName];

    			for (var i = 0; i < groupToLink.length-1; i++) {
                	for (var j = i+1; j < groupToLink.length; j++) {
                		if (members.hasOwnProperty(groupToLink[i]) && members.hasOwnProperty(groupToLink[j])) {
		                    edges.push({
		                        from: members[groupToLink[i]].id,
		                        to: members[groupToLink[j]].id,
		                        value: 1.5,
		                        dashes: true,
		                        color:{color: newResearchGroupColours[groupName], opacity: 0.75}
		                    });
	                    }
                	}
                }
    		}
    	}
    }


    data = {nodes:nodes, edges:edges};

    network.setData(data)

     network.on("beforeDrawing", function (ctx) {
     	var numResearchGroups = Object.keys(researchGroups).length;

        var bigRadius = (numResearchGroups+1) * 10 + 5;
        bigRadius = 40;


        for (var name in members) {
        	var member = members[name]

        	var nodePosition = network.getPositions([member.id]);
        	var x = nodePosition[member.id].x;
        	var y = nodePosition[member.id].y;

        	var angle = 0;
        	var angleSplit = 2 * Math.PI / members[name].researchGroups.length;

        	for (const researchGroup of members[name].researchGroups) {
                ctx.fillStyle = researchGroupColours[researchGroup];
                ctx.beginPath();
                ctx.arc(x, y, bigRadius, angle, angle+angleSplit);
                ctx.lineTo(x, y);
                ctx.fill();
                angle += angleSplit;

        	}

        }
    });


    network.on("click", function (params) {
        params.event = "[original event]";
        console.log('click event, getNodeAt returns: ' + this.getNodeAt(params.pointer.DOM));
    });

}

function getNodeData(data) {
    var networkNodes = [];

    data.forEach(function(elem, index, array) {
        networkNodes.push({id: elem.id, label: elem.id, x: elem.x, y: elem.y});
    });

    return new vis.DataSet(networkNodes);
}

function getNodeById(data, id) {
    for (var n = 0; n < data.length; n++) {
        if (data[n].id == id) {  // double equals since id can be numeric or string
          return data[n];
        }
    };

    throw 'Can not find id \'' + id + '\' in data';
}

function getEdgeData(data) {
    var networkEdges = [];

    data.forEach(function(node) {
        // add the connection
        node.connections.forEach(function(connId, cIndex, conns) {
            networkEdges.push({from: node.id, to: connId});
            let cNode = getNodeById(data, connId);

            var elementConnections = cNode.connections;

            // remove the connection from the other node to prevent duplicate connections
            var duplicateIndex = elementConnections.findIndex(function(connection) {
              return connection == node.id; // double equals since id can be numeric or string
            });


            if (duplicateIndex != -1) {
              elementConnections.splice(duplicateIndex, 1);
            };
      });
    });

    return new vis.DataSet(networkEdges);
}

function resizeExportArea() {
    exportArea.style.height = (1 + exportArea.scrollHeight) + "px";
}
