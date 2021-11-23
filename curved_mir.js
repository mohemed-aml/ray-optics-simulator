var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 59;

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
        if(this.y1 == this.y2) {
            this.flag_horz = true;
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

// ["flat_mir", 650, 550, 650, 350], ["flat_mir", 550, 250, 350, 250], ["flat_mir", 250, 350, 250, 550], ["flat_mir", 350, 650, 550, 650]
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

var temp_ray = [[920, 380, 970, 430, "red"], [230, 400, 280, 450, "blue"]];
var rays = [];

for(var i = 0; i < temp_ray.length; i++) {
    angle = findAngle(temp_ray[i][0], temp_ray[i][1], temp_ray[i][2], temp_ray[i][3]);
    rays[i] = new Ray(temp_ray[i][0], temp_ray[i][1], angle, temp_ray[i][4]);
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
        console.log(JSON.stringify(rays[i], null, 4))

        while(flag_canvas_interract == false && count < 200) {

            var flag_interact = false;
            var interacting_element;

            for(var j = 0; j < elements.length; j++) {
                console.log("i = ", i, "j = ", j, "\nCurrent: ", JSON.stringify(current_ray, null, 4), "\nNew: ", JSON.stringify(new_ray, null, 4), "\nElement: ", JSON.stringify(elements[j], null, 4));
                
                if(elements[j].surface == "flat") {
                    console.log("Flat Element");
                    if (current_ray.checkRayFlatSurfaceIntersection(elements[j]) == false) {
                        console.log("checkRayEqn Failed by current ray", JSON.stringify(current_ray, null, 4), "for element", JSON.stringify(elements[j], null, 4));
                        continue;
                    }
    
                    current_ray.findFlatSurfaceCoordinates(elements[j]);
                    console.log("Current Ray Coordinates", JSON.stringify(current_ray, null, 4));
    
                    if(current_ray.checkCoordinatesDirection(current_ray.new_x, current_ray.new_y) == false) {
                        console.log("checkCoordinatesDirection Failed by current ray", current_ray, "for element", elements[j]);
                        continue;
                    }
    
                    if(current_ray.checkDistance(current_ray.x, current_ray.y, current_ray.new_x, current_ray.new_y)) {
                        new_ray.x = current_ray.new_x;
                        new_ray.y = current_ray.new_y;
                        interacting_element = elements[j];
                        flag_interact = true;
                    }
                    else {
                        console.log("Check Distance Failed");
                    }
                }
                else if(elements[j].surface == "curved") {
                    console.log("Curved Element");
                    current_ray.findABCDE(elements[j].x_center, elements[j].y_center, elements[j].radius);

                    if(current_ray.D <= 0){
                        console.log("Failed as Determinant <= zero", current_ray.A, current_ray.B, current_ray.C, current_ray.D);
                        continue;
                    }

                    var coordinates = current_ray.findCurvedPointsOfIntersection();
                    console.log("Current Ray Coordinates", JSON.stringify(coordinates));

                    for(var k = 0; k < 2; k++) {
                        if(current_ray.checkCoordinatesDirection(coordinates[k][0], coordinates[k][1]) == false) {
                            console.log("checkCoordinatesDirection Failed by Point", coordinates[k][0], coordinates[k][1], "for element", JSON.stringify(elements[j], null, 4));
                            current_ray.flag_AB[k] = false;
                            continue;
                        }

                        var temp_mid_ang = findAngle(elements[j].x_center, elements[j].y_center, coordinates[k][0], coordinates[k][1]);
                        temp_mid_ang = (2*Math.PI - temp_mid_ang)
                        console.log(temp_mid_ang, elements[j].direction, elements[j].findDirection(elements[j].start_ang, temp_mid_ang, elements[j].end_ang));
                        if(elements[j].findDirection(elements[j].start_ang, temp_mid_ang, elements[j].end_ang) != elements[j].direction) {
                            console.log("Coordinates in Curved Mirror surface Failed by Point", coordinates[k][0], coordinates[k][1], "for element", JSON.stringify(elements[j], null, 4));
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
                            console.log("Check Distance Failed");
                        }
                    }
                }
            }

            if (flag_interact == true) {
                console.log("New Ray Before Interaction \nCurrent: ", JSON.stringify(current_ray, null, 4), "\nNew: ", JSON.stringify(new_ray, null, 4), "\nElement: ", JSON.stringify(interacting_element, null, 4));
                new_ray.findNewAngle(current_ray.angle_rad, current_ray.quad, interacting_element.angle_rad);
                new_ray.findQuadrant(); 
                console.log("New Ray After Interaction ", JSON.stringify(new_ray, null, 4))
            }
            else {
                current_ray.findBoundaryCoordinates();
                new_ray.x = current_ray.x_boundary;
                new_ray.y = current_ray.y_boundary;
                flag_canvas_interract = true;
                console.log("new ray", new_ray);
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

drawElements(rays, elements);