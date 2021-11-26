var canvas = document.getElementById("simulationArea");
var toolbarHeight = document.getElementById("toolbar").offsetHeight;
canvas.width = window.innerWidth - 5;
canvas.height = window.innerHeight - toolbarHeight - 5.1;

var c = canvas.getContext('2d');

class flatMirror {
    constructor(x1_cord, y1_cord, x2_cord, y2_cord) {
        this.x1 = x1_cord;
        this.y1 = y1_cord;
        this.x2 = x2_cord;
        this.y2 = y2_cord;
        this.slope;
        this.angle_rad;
        this.flag_vert = false;
        this.flag_horz = false;
        this.surface = "flat";
        this.type = "reflective";
        this.drawMirror();
        this.checkVertHorz();
        this.findSlope();
        this.findAngRad();
    }
    findSlope() {
        this.slope = (this.y1 - this.y2)/(this.x2 - this.x1);
    }
    findAngRad() {
        this.angle_rad = Math.atan(this.slope);
    }
    drawMirror() {
        c.beginPath();
        c.lineWidth = 1;
        c.moveTo(this.x1, this.y1);
        c.lineTo(this.x2, this.y2);
        c.strokeStyle = "yellow";
        c.stroke();
    }
    showPoints() {
        c.fillStyle = "red";
        c.fillRect(this.x1-4, this.y1-4, 8, 8);
        c.fillRect(this.x2-4, this.y2-4, 8, 8);
    }
    checkVertHorz() { 
        if(this.x1 == this.x2) {
            this.flag_vert = true;
        }
        else {
            this.flag_vert = false;
        }
        if(this.y1 == this.y2) {
            this.flag_horz = true;
        }
        else {
            this.flag_horz = false;
        }
    }
}

class curvedMirror {
    constructor(x1_cord, y1_cord, x2_cord, y2_cord, x3_cord, y3_cord) {
        this.x1 = x1_cord;
        this.y1 = y1_cord;
        this.x2 = x2_cord;
        this.y2 = y2_cord;
        this.x3 = x3_cord;
        this.y3 = y3_cord;
        this.x_center;
        this.y_center;
        this.radius;
        this.slope1;
        this.slope2;
        this.slope3;
        this.start_ang;
        this.end_ang;
        this.mid_ang;
        this.direction = false;
        this.angle_rad;
        this.surface = "curved";
        this.type = "reflective";
        // this.angle_rad;
        // this.flag_vert = false;
        // this.flag_horz = false;
        this.findCenter();
        this.findRadius();
        this.findSlopes();
        this.findAngle();
        this.findAngles();
        this.direction = this.findDirection(this.start_ang, this.mid_ang, this.end_ang);
        this.drawMirror();
        // this.checkVertHorz();

    }
    RadToDeg(angle) {
        return (angle * 180 / Math.PI);
    }
    findCenter() {
        this.x_center = 0.5 * ((this.x1**2 + this.y1**2)*(this.y2-this.y3) + (this.x2**2 + this.y2**2)*(this.y3-this.y1) + (this.x3**2 + this.y3**2)*(this.y1-this.y2)) / (this.x1*(this.y2-this.y3) + this.x2*(this.y3-this.y1) + this.x3*(this.y1-this.y2));
        if(this.y3 == this.y2) {
            this.y_center = 0.5 * ((this.y1+this.y3) + (this.x3-this.x1)*(this.x1+this.x3-(2*this.x_center))/(this.y3-this.y1));
        }
        else {
            this.y_center = 0.5 * ((this.y2+this.y3) + (this.x3-this.x2)*(this.x2+this.x3-(2*this.x_center))/(this.y3-this.y2));
        }
    }
    findRadius() {
        this.radius = Math.sqrt(Math.pow((this.x_center-this.x1), 2) + Math.pow((this.y_center-this.y1), 2));
    }
    findSlopes() {
        this.slope1 = (this.y_center - this.y1)/(this.x1 - this.x_center);
        this.slope2 = (this.y_center - this.y2)/(this.x2 - this.x_center);
        this.slope3 = (this.y_center - this.y3)/(this.x3 - this.x_center);
    }
    findAngle(slope, x, y) {
        var ang;
        if(slope == null) {
            ang = Math.PI/2;
        }
        else {
            ang = Math.atan(slope);
        }
        if(ang < 0) {
            ang += Math.PI;
        }
        if(this.y_center < y || (y == this.y_center && x < this.x_center)) {
            ang += Math.PI;
        }
        return (2*Math.PI - ang);
    }
    findAngles() {
        this.start_ang = this.findAngle(this.slope2, this.x2, this.y2);
        this.mid_ang = this.findAngle(this.slope3, this.x3, this.y3);
        this.end_ang = this.findAngle(this.slope1, this.x1, this.y1);
    }
    findDirection(start_ang, mid_ang, end_ang) {
        if((mid_ang < start_ang && start_ang < end_ang) || (start_ang < end_ang && end_ang < mid_ang) || (end_ang < mid_ang && mid_ang < start_ang)) {
            return true;
        }
        else {
            return false;
        }
    }
    drawMirror() {
        c.beginPath();
        c.lineWidth = 1;
        c.arc(this.x_center, this.y_center, this.radius, this.start_ang, this.end_ang, this.direction)
        c.strokeStyle = "yellow";
        c.stroke();
    }
    checkVertHorz() {
        if(this.x1 == this.x2) {
            this.flag_vert = true;
        }
        if(this.y1 == this.y2) {
            this.flag_horz = true;
        }
    }
    showPoints() {
        c.fillStyle = "red";
        c.fillRect(this.x1-4, this.y1-4, 8, 8);
        c.fillRect(this.x2-4, this.y2-4, 8, 8);
        c.fillRect(this.x3-4, this.y3-4, 8, 8);
        c.fillStyle = "blue";
        c.fillRect(this.x_center-4, this.y_center-4, 8, 8);
    }
    findTangentSlopeAtCoordinate(x, y) {
        return (this.x_center - x) / (this.y_center - y);
    }
}

class Ray {
    constructor(x_cord, y_cord, angle, colour) {
        this.x = x_cord;
        this.y = y_cord;
        this.angle_rad = angle % (2*Math.PI);
        this.color = colour;
        this.slope;
        this.quad;
        this.closest_dist = 4000;
        this.flag_vert = false;
        this.flag_horz = false;
        this.A;
        this.B;
        this.C;
        this.D;
        this.xA;
        this.yA;
        this.xB;
        this.yB;
        this.flag_AB = [true, true];
        this.new_x;
        this.new_y;
        this.dir_x;
        this.dir_y;
        this.findSlope();
        this.findQuadrant();
        this.checkVertHorz();
    }

    findSlope() {
        this.slope = Math.tan(this.angle_rad);
    }

    findQuadrant() {
        if(this.angle_rad >= 0 && this.angle_rad < 0.5*Math.PI) {
            this.quad = 1;
        }
        else if(this.angle_rad >= 0.5*Math.PI && this.angle_rad < Math.PI) {
            this.quad = 2;
        }
        else if(this.angle_rad >= Math.PI && this.angle_rad < 1.5*Math.PI) {
            this.quad = 3;
        }
        else {
            this.quad = 4;
        }
    }

    // findAngRad() {
    //     if(this.slope == null) {
    //         this.angle_rad = Math.PI/2;
    //     }
    //     else {
    //         this.angle_rad = Math.atan(this.slope);
    //     }
    //     if(this.angle_rad < 0) {
    //         this.angle_rad += Math.PI;
    //     }
    //     if(this.quad == 3 || this.quad == 4) {
    //         this.angle_rad += Math.PI;
    //     }
    // }

    // RadToDeg() {
    //     this.angle_deg = (this.angle_rad/Math.PI) * 180;
    // }

    checkVertHorz() {
        if(this.angle_rad == 0.5*Math.PI || this.angle_rad == 1.5*Math.PI) {
            this.flag_vert = true;
        }
        else if(this.angle_rad == 0 || this.angle_rad == Math.PI) {
            this.flag_horz = true;
        }
    }

    rayEqn(x, y) {
        return (this.slope*(x - this.x) + y - this.y)
    }

    checkRayFlatSurfaceIntersection(element) {
        if(this.rayEqn(element.x1, element.y1) * this.rayEqn(element.x2, element.y2) < 0) {
            return true;
        }
        else if(this.rayEqn(element.x1, element.y1) * this.rayEqn(element.x2, element.y2) == 0) {
            if (this.rayEqn(element.x1, element.y1) == 0 && this.rayEqn(element.x2, element.y2) == 0) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    }

    findFlatSurfaceCoordinates(element) {
        if(element.flag_vert) {
            if(this.flag_horz) {
                // Finds the value of x and y for a horizontal ray and a vertical mirror
                this.new_x = element.x1;
                this.new_y = this.y;
            }
            else {
                // Finds the value of x and y for a ray which has slope neither 0 nor infinity and a vertical mirror
                this.new_x = element.x1;
                this.new_y = this.y + this.slope * (this.x - element.x1);
            }
        }
        else if(element.flag_horz) {
            if(this.flag_vert) {
                // Finds the value of x and y for a vertical ray and a horizontal mirror
                this.new_x = this.x;
                this.new_y = element.y1;
            }
            else {
                // Finds the value of x and y for a ray which has slope neither 0 nor infinity and a horizontal mirror
                this.new_x = this.x + (this.y - element.y1)/this.slope;
                this.new_y = element.y1;
            }
        }
        else if(this.flag_vert) {
            // Finds the value of x and y for a vertical ray and a mirror which has slope neither 0 nor infinity
            element.findSlope();
            this.new_x = this.x;
            this.new_y = element.y1 + element.slope*(element.x1 - this.x);
        }
        else if(this.flag_horz) {
            // Finds the value of x and y for a horizontal ray and a mirror which has slope neither 0 nor infinity
            element.findSlope();
            this.new_x = element.x1 + (element.y1 - this.y)/element.slope;
            this.new_y = this.y;
        }
        else {
            element.findSlope();
            // Point of Intersection of mirror and Ray equations
            this.new_x = ((element.y1 - this.y) + (element.slope*element.x1 - this.slope*this.x)) / (element.slope - this.slope);
            this.new_y = ((this.slope*element.slope*(this.x - element.x1)) + (element.slope*this.y - this.slope*element.y1)) / (element.slope - this.slope);
        }
    }

    checkCoordinatesDirection(point_x, point_y) {
        var flag_ray_dir = false;
        // checking if the mirror is in the direction that the ray is pointing at
        switch(this.quad) {
            case 1: {
            if(point_x >= this.x && point_y <= this.y) {
                flag_ray_dir = true;
            }
            break;
            }
            case 2: {
            if(point_x <= this.x && point_y <= this.y) {
                flag_ray_dir = true;
            }
            break;
            }
            case 3: {
            if(point_x <= this.x && point_y >= this.y) {
                flag_ray_dir = true;
            }
            break;
            }
            case 4: {
            if(point_x >= this.x && point_y >= this.y) {
                flag_ray_dir = true;
            }
            break;
            }
        }
        return flag_ray_dir;
    }

    findBoundaryCoordinates() {
        if(this.angle_rad == 0.5*Math.PI) {
            this.x_boundary = this.x;
            this.y_boundary = 0;
        }
        else if(this.angle_rad == 1.5*Math.PI) {
            this.x_boundary = this.x;
            this.y_boundary = canvas.height;
        }
        else if(this.angle_rad == 0) {
            this.x_boundary = canvas.width;
            this.y_boundary = this.y;
        }
        else if(this.angle_rad == Math.PI) {
            this.x_boundary = 0;
            this.y_boundary = this.y;
        }
        else {
            switch(this.quad) {
              case 1: {
                if((this.x + (this.y / this.slope)) <= canvas.width) {
                    this.x_boundary = this.x + (this.y / this.slope);
                    this.y_boundary = 0;
                }
                else {
                    this.x_boundary = canvas.width;
                    this.y_boundary = this.y - this.slope*(canvas.width - this.x)
                }
                break;
              }
              case 2: {
                if((this.x + (this.y / this.slope)) >= 0) {
                    this.x_boundary = this.x + (this.y / this.slope);
                    this.y_boundary = 0;
                }
                else {
                    this.x_boundary = 0;
                    this.y_boundary = this.y + this.slope*this.x;
                }
                break;
              }
              case 3: {
                if((this.y + (this.slope * this.x))  <= canvas.height) {
                    this.x_boundary = 0;
                    this.y_boundary = this.y + (this.slope *this.x);
                }
                else {
                    this.x_boundary = this.x - (canvas.height - this.y) / this.slope;
                    this.y_boundary = canvas.height;
                }
                break;
              }
              case 4: {
                if((this.x + (canvas.height - this.y) / this.slope) <= canvas.width) {
                    this.x_boundary = this.x + (this.y - canvas.height) / this.slope;
                    this.y_boundary = canvas.height;
                }
                else {
                    this.x_boundary = canvas.width;
                    this.y_boundary = this.y - this.slope*(canvas.width - this.x);
                }
                break;
              }
            }
        }
    }

    checkDistance(x, y, new_x, new_y) {
        if(Math.sqrt( Math.pow((new_x - x), 2) + Math.pow((new_y - y), 2) ) < 0.5) {
            return false;
        }
        else if(Math.sqrt( Math.pow((new_x - x), 2) + Math.pow((new_y - y), 2) ) < this.closest_dist) {
            this.closest_dist = Math.sqrt( Math.pow((new_x - x), 2) + Math.pow((new_y - y), 2) );
            return true;
        }
        else {
            return false;
        }
    }

    findNewAngle(ray_angle, quad, mir_angle) {
        if(mir_angle <= 0) {
            mir_angle += Math.PI;
        }
        if(quad == 3 || quad == 4) {
            mir_angle += Math.PI;
        }

        this.angle_rad = ray_angle + 2*(mir_angle - ray_angle);
        if(this.angle_rad < 0) {
            this.angle_rad += 2*Math.PI;
        }
        this.angle_rad %= (2*Math.PI);
        // this.RadToDeg();
    }

    findABCDE(a, b, r) {
        this.A = 1 + this.slope**2;
        this.B = 2*(this.slope*( b - this.y - this.slope*this.x) - a);
        this.C = ((a**2 + b**2 + this.y**2 - r**2 - 2*b*this.y) + this.slope*this.x*(this.slope*this.x + 2*(this.y - b)));
        this.D = this.B**2 - 4*this.A*this.C;
    }

    findCurvedPointsOfIntersection() {
        this.xA = (-1*this.B + Math.sqrt(this.D)) / (2*this.A);
        this.yA = this.y + this.slope*(this.x - this.xA);

        this.xB = (-1*this.B - Math.sqrt(this.D)) / (2*this.A);
        this.yB = this.y + this.slope*(this.x - this.xB);
        return [[this.xA, this.yA], [this.xB, this.yB]];
    }

}

function findAngle(x1, y1, x2, y2) {
    var angle_temp;
    var slope_temp = (y1 - y2)/(x2 - x1);

    if(slope_temp == null) {
        angle_temp = 0.5*Math.PI;
    }
    else {    
        angle_temp = Math.atan(slope_temp);
    }
    if(angle_temp < 0) {
        angle_temp += Math.PI;
    }
    if(y1 < y2 || (y2 == y1 && x2 < x1)) {
        angle_temp += Math.PI;
    }

    return angle_temp;
}

function drawElements(rays, elements) {

    c.clearRect(0, 0, canvas.width, canvas.height);

    // drawing Each Reflective and Refractive Surface
    for(var i = 0; i < elements.length; i++) {
        if(elements[i].type == "reflective") {
            // console.log(JSON.stringify(elements[0], null, 4));
            elements[i].drawMirror();
            elements[i].showPoints();
        }
        else if(elements[i].type == "refractive") {
            elements[i].drawMaterial();
        }
        else if(elements[i].type == "opaque") {
            elements[i].drawBlocker();
        }
        else {
            console.log("Unrecognised Material");
        }
    }

    // drawing Each Ray
    for(var i = 0; i < rays.length; i++) {

        // rays[i].showPoints();
        var flag_canvas_interract = false;
        var current_ray = new Ray(rays[i].x, rays[i].y, rays[i].angle_rad);
        var new_ray = new Ray(rays[i].x, rays[i].y, rays[i].angle_rad);
        var count = 1
        // console.log(JSON.stringify(rays[i], null, 4))

        while(flag_canvas_interract == false && count < 200) {

            var flag_interact = false;
            var interacting_element;

            for(var j = 0; j < elements.length; j++) {
                // console.log("i = ", i, "j = ", j, "\nCurrent: ", JSON.stringify(current_ray, null, 4), "\nNew: ", JSON.stringify(new_ray, null, 4), "\nElement: ", JSON.stringify(elements[j], null, 4));
                
                if(elements[j].surface == "flat") {
                    // console.log("Flat Element");
                    if (current_ray.checkRayFlatSurfaceIntersection(elements[j]) == false) {
                        // console.log("checkRayEqn Failed by current ray", JSON.stringify(current_ray, null, 4), "for element", JSON.stringify(elements[j], null, 4));
                        continue;
                    }
    
                    current_ray.findFlatSurfaceCoordinates(elements[j]);
                    // console.log("Current Ray Coordinates", JSON.stringify(current_ray, null, 4));
    
                    if(current_ray.checkCoordinatesDirection(current_ray.new_x, current_ray.new_y) == false) {
                        // console.log("checkCoordinatesDirection Failed by current ray", current_ray, "for element", elements[j]);
                        continue;
                    }
    
                    if(current_ray.checkDistance(current_ray.x, current_ray.y, current_ray.new_x, current_ray.new_y)) {
                        new_ray.x = current_ray.new_x;
                        new_ray.y = current_ray.new_y;
                        interacting_element = elements[j];
                        flag_interact = true;
                    }
                    else {
                        // console.log("Check Distance Failed");
                    }
                }
                else if(elements[j].surface == "curved") {
                    // console.log("Curved Element");
                    current_ray.findABCDE(elements[j].x_center, elements[j].y_center, elements[j].radius);

                    if(current_ray.D <= 0){
                        // console.log("Failed as Determinant <= zero", current_ray.A, current_ray.B, current_ray.C, current_ray.D);
                        continue;
                    }

                    var coordinates = current_ray.findCurvedPointsOfIntersection();
                    // console.log("Current Ray Coordinates", JSON.stringify(coordinates));

                    for(var k = 0; k < 2; k++) {
                        if(current_ray.checkCoordinatesDirection(coordinates[k][0], coordinates[k][1]) == false) {
                            // console.log("checkCoordinatesDirection Failed by Point", coordinates[k][0], coordinates[k][1], "for element", JSON.stringify(elements[j], null, 4));
                            current_ray.flag_AB[k] = false;
                            continue;
                        }

                        var temp_mid_ang = findAngle(elements[j].x_center, elements[j].y_center, coordinates[k][0], coordinates[k][1]);
                        temp_mid_ang = (2*Math.PI - temp_mid_ang)
                        // console.log(temp_mid_ang, elements[j].direction, elements[j].findDirection(elements[j].start_ang, temp_mid_ang, elements[j].end_ang));
                        if(elements[j].findDirection(elements[j].start_ang, temp_mid_ang, elements[j].end_ang) != elements[j].direction) {
                            // console.log("Coordinates in Curved Mirror surface Failed by Point", coordinates[k][0], coordinates[k][1], "for element", JSON.stringify(elements[j], null, 4));
                            current_ray.flag_AB[k] = false;
                            continue;
                        }

                        if(current_ray.checkDistance(current_ray.x, current_ray.y, coordinates[k][0], coordinates[k][1 ])) {
                            new_ray.x = coordinates[k][0];
                            new_ray.y = coordinates[k][1];
                            interacting_element = elements[j];
                            var curved_mir_slope = interacting_element.findTangentSlopeAtCoordinate(new_ray.x, new_ray.y);

                            interacting_element.angle_rad = Math.atan(curved_mir_slope);
                            flag_interact = true;
                        }
                        else {
                            // console.log("Check Distance Failed");
                        }
                    }
                }
            }

            if (flag_interact == true) {
                // console.log("New Ray Before Interaction \nCurrent: ", JSON.stringify(current_ray, null, 4), "\nNew: ", JSON.stringify(new_ray, null, 4), "\nElement: ", JSON.stringify(interacting_element, null, 4));
                new_ray.findNewAngle(current_ray.angle_rad, current_ray.quad, interacting_element.angle_rad);
                new_ray.findQuadrant(); 
                // console.log("New Ray After Interaction ", JSON.stringify(new_ray, null, 4))
            }
            else {
                current_ray.findBoundaryCoordinates();
                new_ray.x = current_ray.x_boundary;
                new_ray.y = current_ray.y_boundary;
                flag_canvas_interract = true;
                // console.log("new ray", new_ray);
            }
            c.beginPath();
            c.lineWidth = 1;
            c.moveTo(current_ray.x, current_ray.y);
            c.lineTo(new_ray.x, new_ray.y);
            console.log(rays[i].color);
            c.strokeStyle = rays[i].color;
            c.stroke();

            current_ray.x = new_ray.x;
            current_ray.y = new_ray.y;
            current_ray.angle_rad = new_ray.angle_rad;
            current_ray.closest_dist = 4000;
            current_ray.findSlope();
            current_ray.findQuadrant();
            current_ray.checkVertHorz();
            count += 1;
        }
    }
}
// 
var temp_mir = [["curved_mir", 650, 550, 1050, 550, 850, 350], ["flat_mir", 350, 650, 550, 650]];
var elements = [];
for(var i = 0; i < temp_mir.length; i++) {
    console.log("Creating Objects of the Elements");
    if(temp_mir[i][0] == "flat_mir") {
        elements[i] = new flatMirror(temp_mir[i][1], temp_mir[i][2], temp_mir[i][3], temp_mir[i][4]);
    }
    if(temp_mir[i][0] == "curved_mir") {
        elements[i] = new curvedMirror(temp_mir[i][1], temp_mir[i][2], temp_mir[i][3], temp_mir[i][4], temp_mir[i][5], temp_mir[i][6]);
    }
}

var shapes = [];
var shape_no;
var rays = [];
var ray_no = -1;
var el_no = 1;
var move_type = "";
var custom_shape = [];
var flag_begin_click = false;
var flag_end_click = true;
var current_button = "";
var move_12;
var move_pos;
var flag_move = false;

document.getElementById("addLightRay").addEventListener("click", function() {current_button = "add light ray", flag_end_click = true});
document.getElementById("addFlatMirror").addEventListener("click", function() {current_button = "add flat mir", flag_end_click = true});
document.getElementById("addFreeBody").addEventListener("click", function() {current_button = "add free body"});
document.getElementById("moveObjects").addEventListener("click", function() {current_button = "move objects"});
document.getElementById("ResetButton").addEventListener("click", function() {current_button = ""});

function getCursorPosition(canvas, event) {
    // console.log(event);
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    // console.log("x: " + x + " y: " + y)
    return([x, y]);
}

canvas.addEventListener('click',
    function(e) {
        var xy = getCursorPosition(canvas, e);
        var x_cord = xy[0];
        var y_cord = xy[1];
        
        switch(current_button) {
            case "add light ray":
                if(flag_end_click) {
                    console.log('Ray Begin mouse click', x_cord, y_cord);
                    rays.push(new Ray(x_cord, y_cord, 0, "yellow"));
                    ray_no += 1;

                    flag_begin_click = true;
                    flag_end_click = false;

                    canvas.addEventListener('mousemove', mouseMove);
                }
                else {
                    console.log('Ray End Mouse click', x_cord, y_cord);
                    rays[ray_no].angle_rad = findAngle(rays[ray_no].x, rays[ray_no].y, x_cord, y_cord);
                    rays[ray_no].dir_x = x_cord;
                    rays[ray_no].dir_y = y_cord;
                    rays[ray_no].findSlope();
                    rays[ray_no].findQuadrant();
                    rays[ray_no].checkVertHorz();

                    flag_begin_click = false;
                    flag_end_click = true;
                    canvas.removeEventListener("mousemove", mouseMove);

                    drawElements(rays, elements);

                    c.fillStyle = "red";
                    c.fillRect(rays[ray_no].x-4, rays[ray_no].y-4, 8, 8);
                    c.fillRect(x_cord-4, y_cord-4, 8, 8);
                }
                break;

            case "add flat mir":
                if(flag_end_click) {
                    console.log('Flat Mir Begin mouse click', x_cord, y_cord);
                    elements.push(new flatMirror(x_cord, y_cord, x_cord, y_cord));
                    el_no += 1;

                    flag_end_click = false;

                    canvas.addEventListener('mousemove', mouseMove);
                }
                else {
                    console.log('Flat Mir End Mouse click', x_cord, y_cord);
                    elements[el_no].x2 = x_cord;
                    elements[el_no].y2 = y_cord;
                    elements[el_no].checkVertHorz();
                    elements[el_no].findSlope();
                    elements[el_no].findAngRad();

                    flag_end_click = true;
                    canvas.removeEventListener("mousemove", mouseMove);

                    drawElements(rays, elements);

                    c.fillStyle = "red";
                    c.fillRect(elements[el_no].x1-4, elements[el_no].y1-4, 8, 8);
                    c.fillRect(x_cord-4, y_cord-4, 8, 8);
                }
                break;

            case "add free body":
                if(flag_begin_click) {
                    console.log('first mouse click', x_cord, y_cord);
                    custom_shape.push(xy);
                    flag_first_click = false; 
                    c.fillStyle = "red";
                    c.fillRect(x_cord, y_cord, 3, 3);
                }
                else if(Math.abs(x_cord - custom_shape[0][0]) <=5  && Math.abs(y_cord - custom_shape[0][1]) <=5) {
                    console.log('Final Mouse click', x_cord, y_cord);
                    // console.log(custom_shape);
                    let region = new Path2D();
                    region.moveTo(custom_shape[0][0], custom_shape[0][1]);
                    for(i = 1; i < custom_shape.length; i++) {
                        region.lineTo(custom_shape[i][0], custom_shape[i][1]);
                    }
                    region.closePath();
                    c.fillStyle = "rgba(255, 255, 255, 0.1)";
                    c.fill(region);
                    custom_shape.push([x_cord, y_cord]);
                    shapes.push(custom_shape);
                    custom_shape = [];
                    flag_first_click = true;
                }
                else {
                    console.log('Mouse click', x_cord, y_cord);
                    custom_shape.push([x_cord, y_cord]);
                    c.fillStyle = "red";
                    c.fillRect(x_cord, y_cord, 3, 3);
                }
                break;
        }
    }
)

canvas.addEventListener("mousedown", 
    function(e) {
        var xy = getCursorPosition(canvas, e);
        var x_cord = xy[0];
        var y_cord = xy[1];
        console.log("Mouse Down", xy);
        
        switch(current_button) {
            case "move objects":
                console.log(JSON.stringify(rays, null, 4), JSON.stringify(elements, null, 4));
                for(var i = 0; i < rays.length; i++) {
                    if(Math.abs(x_cord - rays[i].x) <= 5  && Math.abs(y_cord - rays[i].y) <= 5) {
                        rays[i].x = x_cord;
                        rays[i].y = y_cord;
                        move_12 = "1";
                        move_pos = i;
                        flag_move = true;
                    }
                    else if(Math.abs(x_cord - rays[i].dir_x) <= 5  && Math.abs(y_cord - rays[i].dir_y) <= 5) {
                        rays[i].dir_x = x_cord;
                        rays[i].dir_y = y_cord;
                        move_12 = "2";
                        move_pos = i;
                        flag_move = true;
                    }
                    else {
                        // console.log("None of the Above");
                    }
                    if(flag_move) {
                        move_type = "ray";
                        rays[i].angle_rad = findAngle(rays[i].x, rays[i].y, rays[i].dir_x, rays[i].dir_y);
                        rays[i].findSlope();
                        rays[i].findQuadrant();
                        rays[i].checkVertHorz();
                        c.fillStyle = "red";
                        c.fillRect(rays[i].x-4, rays[i].y-4, 8, 8);
                        c.fillRect(rays[i].dir_x-4, rays[i].dir_y-4, 8, 8);
                        // console.log(move_12, move_pos);
                        canvas.addEventListener('mousemove', mouseMove);
                    }
                }
                for(var i = 0; i < elements.length; i++) {
                    if(elements[i].surface == "flat") {
                        if(Math.abs(x_cord - elements[i].x1) <= 5  && Math.abs(y_cord - elements[i].y1) <= 5) {
                            elements[i].x1 = x_cord;
                            elements[i].y1 = y_cord;
                            move_12 = "1";
                            move_pos = i;
                            flag_move = true;
                        }
                        else if(Math.abs(x_cord - elements[i].x2) <= 5  && Math.abs(y_cord - elements[i].y2) <= 5) {
                            elements[i].x2 = x_cord;
                            elements[i].y2 = y_cord;
                            move_12 = "2";
                            move_pos = i;
                            flag_move = true;
                        }
                        else {
                            console.log("None of the Above");
                        }
                        if(flag_move) {
                            move_type = "element";
                            elements[i].checkVertHorz();
                            elements[i].findSlope();
                            elements[i].findAngRad();

                            c.fillStyle = "red";
                            c.fillRect(elements[i].x1-4, elements[i].y1-4, 8, 8);
                            c.fillRect(elements[i].x2-4, elements[i].y2-4, 8, 8);
                            // console.log(move_12, move_pos);
                            canvas.addEventListener('mousemove', mouseMove);
                        }
                    }
                    
                }
                break;
        }
    }
)

canvas.addEventListener("mouseup", 
    function(e) {
        var xy = getCursorPosition(canvas, e);
        var x_cord = xy[0];
        var y_cord = xy[1];
        console.log("Mouse Up", xy);
        
        switch(current_button) {
            case "move objects":
                if(flag_move) {
                    if(move_type == "ray") {
                        if(move_12 == "1") {
                            rays[move_pos].x = x_cord;
                            rays[move_pos].y = y_cord;
                        }
                        else if(move_12 == "2") {
                            rays[move_pos].dir_x = x_cord;
                            rays[move_pos].dir_y = y_cord;
                        }

                        rays[move_pos].angle_rad = findAngle(rays[move_pos].x, rays[move_pos].y, rays[move_pos].dir_x, rays[move_pos].dir_y);
                        rays[move_pos].findSlope();
                        rays[move_pos].findQuadrant();
                        rays[move_pos].checkVertHorz();
                        drawElements(rays, elements);
                        c.fillStyle = "red";
                        c.fillRect(rays[move_pos].x-4, rays[move_pos].y-4, 8, 8);
                        c.fillRect(rays[move_pos].dir_x-4, rays[move_pos].dir_y-4, 8, 8);
                        canvas.removeEventListener("mousemove", mouseMove);
                        flag_move = false;
                    }
                    else if(move_type == "element") {
                        if(move_12 == "1") {
                            elements[move_pos].x1 = x_cord;
                            elements[move_pos].y1 = y_cord;
                        }
                        else if(move_12 == "2") {
                            elements[move_pos].x2 = x_cord;
                            elements[move_pos].y2 = y_cord;
                        }
                        elements[move_pos].checkVertHorz();
                        elements[move_pos].findSlope();
                        elements[move_pos].findAngRad();
                        
                        // console.log(move_12, move_pos);
                        canvas.addEventListener('mousemove', mouseMove);
                        drawElements(rays, elements);

                        c.fillStyle = "red";
                        c.fillRect(elements[move_pos].x1-4, elements[move_pos].y1-4, 8, 8);
                        c.fillRect(elements[move_pos].x2-4, elements[move_pos].y2-4, 8, 8);
                        canvas.removeEventListener("mousemove", mouseMove);

                        flag_move = false;
                    }
                }
                else {
                    console.log("No Element clicked for mouse up");
                }
                break;
            case "add free body":
                break;
        }
    }
)

function mouseMove(ev) {
    var mouse_xy = getCursorPosition(canvas, ev);
    var x_cord = mouse_xy[0];
    var y_cord = mouse_xy[1];

    switch(current_button) {
        case "add light ray":
            rays[ray_no].angle_rad = findAngle(rays[ray_no].x, rays[ray_no].y, mouse_xy[0], mouse_xy[1]);
            rays[ray_no].findSlope();
            rays[ray_no].findQuadrant();
            rays[ray_no].checkVertHorz();
            drawElements(rays, elements);

            c.fillStyle = "red";
            c.fillRect(rays[ray_no].x-4, rays[ray_no].y-4, 8, 8);
            c.fillRect(mouse_xy[0]-4, mouse_xy[1]-4, 8, 8);
            break;
        case "add flat mir":
            elements[el_no].x2 = mouse_xy[0];
            elements[el_no].y2 = mouse_xy[1];
            elements[el_no].checkVertHorz();
            elements[el_no].findSlope();
            elements[el_no].findAngRad();
            console.log(JSON.stringify(rays, null, 4), JSON.stringify(elements, null, 4));
            drawElements(rays, elements);

            c.fillStyle = "red";
            c.fillRect(elements[el_no].x1-4, elements[el_no].y1-4, 8, 8);
            c.fillRect(mouse_xy[0]-4, mouse_xy[1]-4, 8, 8);
            break;
        case "move objects":
            if(move_type == "ray") {
                // console.log("Mouse move", mouse_xy);
                if(move_12 == "1") {
                    rays[move_pos].x = x_cord;
                    rays[move_pos].y = y_cord;
                }
                else if(move_12 == "2") {
                    rays[move_pos].dir_x = x_cord;
                    rays[move_pos].dir_y = y_cord;
                }
                rays[move_pos].angle_rad = findAngle(rays[move_pos].x, rays[move_pos].y, rays[move_pos].dir_x, rays[move_pos].dir_y);
                rays[ray_no].findSlope();
                rays[ray_no].findQuadrant();
                rays[ray_no].checkVertHorz();
                drawElements(rays, elements);
                c.fillStyle = "red";
                c.fillRect(rays[move_pos].x-4, rays[move_pos].y-4, 8, 8);
                c.fillRect(rays[move_pos].dir_x-4, rays[move_pos].dir_y-4, 8, 8);
            }
            else if(move_type == "element") {
                if(move_12 == "1") {
                    elements[move_pos].x1 = x_cord;
                    elements[move_pos].y1 = y_cord;
                }
                else if(move_12 == "2") {
                    elements[move_pos].x2 = x_cord;
                    elements[move_pos].y2 = y_cord;
                }
                elements[move_pos].checkVertHorz();
                elements[move_pos].findSlope();
                elements[move_pos].findAngRad();

                drawElements(rays, elements);

                c.fillStyle = "red";
                c.fillRect(elements[move_pos].x1-4, elements[move_pos].y1-4, 8, 8);
                c.fillRect(elements[move_pos].x2-4, elements[move_pos].y2-4, 8, 8);
            }
            break;
    }
}

console.log(JSON.stringify(rays, null, 4), JSON.stringify(elements, null, 4));