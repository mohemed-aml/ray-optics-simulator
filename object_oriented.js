var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 59;

var c = canvas.getContext('2d');

class Mirror {
    constructor(property, x1_cord, y1_cord, x2_cord, y2_cord) {
        this.x1 = x1_cord;
        this.y1 = y1_cord;
        this.x2 = x2_cord;
        this.y2 = y2_cord;
        this.type = property; // Is this property really necessary, as it's a mirror objective, it's given that it's reflective
        this.slope;
        this.angle_rad;
        this.flag_vert = false;
        this.flag_horz = false;
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
        c.lineWidth = 3;
        c.moveTo(this.x1, this.y1);
        c.lineTo(this.x2, this.y2);
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
}

class Ray {
    constructor(x_cord, y_cord, angle) {
        this.x = x_cord;
        this.y = y_cord;
        this.new_x;
        this.new_y;
        this.angle_deg = angle % 360;
        this.angle_rad;
        this.slope;
        this.quad;
        this.closest_dist = 4000;
        this.flag_vert = false;
        this.flag_horz = false;
        this.findAngRad();
        this.findSlope();
        this.checkVertHorz();
        this.findQuadrant();

    }
    findAngRad() {
        this.angle_rad = (this.angle_deg/180) * Math.PI;
    }

    RadToDeg() {
        this.angle_deg = (this.angle_rad/Math.PI) * 180;
    }

    findSlope() {
        this.slope = Math.tan(this.angle_rad);
    }

    checkVertHorz() {
        if(this.angle_deg == 90 || this.angle_deg == 270) {
            this.flag_vert = true;
        }
        else if(this.angle_deg == 0 || this.angle_deg == 180) {
            this.flag_horz = true;
        }
    }

    findQuadrant() {
        if(this.angle_deg >= 0 && this.angle_deg < 90) {
            this.quad = 1;
        }
        else if(this.angle_deg >= 90 && this.angle_deg < 180) {
            this.quad = 2;
        }
        else if(this.angle_deg >= 180 && this.angle_deg < 270) {
            this.quad = 3;
        }
        else {
            this.quad = 4;
        }
    }

    rayEqn(x, y) {
        return (this.slope*(x - this.x) + y - this.y)
    }

    checkRayEqn(element) {
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

    findCoordinates(element) {
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
            this.new_y.y = this.y;
        }
        else {
            element.findSlope();
            // Point of Intersection of mirror and Ray equations
            this.new_x = ((element.y1 - this.y) + (element.slope*element.x1 - this.slope*this.x)) / (element.slope - this.slope);
            this.new_y = ((this.slope*element.slope*(this.x - element.x1)) + (element.slope*this.y - this.slope*element.y1)) / (element.slope - this.slope);
        }
    }

    checkCoordinates() {
        var flag_ray_dir = false;
        // checking if the mirror is in the direction that the ray is pointing at
        switch(this.quad) {
            case 1: {
            if(this.new_x >= this.x && this.new_y <= this.y) {
                flag_ray_dir = true;
            }
            break;
            }
            case 2: {
            if(this.new_x <= this.x && this.new_y <= this.y) {
                flag_ray_dir = true;
            }
            break;
            }
            case 3: {
            if(this.new_x <= this.x && this.new_y >= this.y) {
                flag_ray_dir = true;
            }
            break;
            }
            case 4: {
            if(this.new_x >= this.x && this.new_y >= this.y) {
                flag_ray_dir = true;
            }
            break;
            }
        }
        return flag_ray_dir;
    }

    findBoundary() {
        if(this.angle_rad == (Math.PI * 0.5)) {
            this.x_boundary = this.x;
            this.y_boundary = 0;
        }
        else if(this.angle_rad == (Math.PI * 1.5)) {
            this.x_boundary = this.x;
            this.y_boundary = canvas.height;
        }
        else if(this.angle_rad == 0) {
            this.x_boundary = canvas.width;
            this.y_boundary = this.y;
        }
        else if(this.angle_rad == (Math.PI)) {
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

    checkDistance() {
        if(Math.sqrt( Math.pow((this.new_x - this.x), 2) + Math.pow((this.new_y - this.y), 2) ) < 0.5) {
            return false;
        }
        else if(Math.sqrt( Math.pow((this.new_x - this.x), 2) + Math.pow((this.new_y - this.y), 2) ) < this.closest_dist) {
            this.closest_dist = Math.sqrt( Math.pow((this.new_x - this.x), 2) + Math.pow((this.new_y - this.y), 2) );
            return true;
        }
        else {
            return false;
        }
    }

    findNewAngle(ray_angle, quad, mir_angle) {
        if(mir_angle < 0) {
            mir_angle += Math.PI;
        }
        if(quad == 3 || quad == 4) {
            mir_angle += Math.PI;
        }

        this.angle_rad = ray_angle + 2*(mir_angle - ray_angle);
        this.angle_rad %= (2 * Math.PI);
        this.RadToDeg();
    }

}

// [x1-cord, y1-cord, x2-cord, y2-cord] ["reflective", 1050, 100, 1050, 400]
var temp_mir = [["reflective", 700, 350, 700, 450], ["reflective", 400, 150, 600, 150], ["reflective", 425, 175, 475, 225]];
var elements = []; // List of Objects
for(var i = 0; i<temp_mir.length; i++) {
    if(temp_mir[i][0] == "reflective") {
        elements[i] = new Mirror(temp_mir[i][0], temp_mir[i][1], temp_mir[i][2], temp_mir[i][3], temp_mir[i][4]);
    }
}

// [x-cord, y-cord, angle in degrees, quadrant] // [750, 0, 330, 0]
var temp_ray = [[600, 500, 50,0]];
var rays = [];
for(var i = 0; i < temp_ray.length; i++) {
  rays[i] = new Ray(temp_ray[i][0], temp_ray[i][1], temp_ray[i][2]);
}

function drawElements(rays, elements) {

    c.clearRect(0, 0, canvas.width, canvas.height);

    // drawing Each Reflective and Refractive Surface
    for(var i = 0; i < elements.length; i++) {
        if(elements[i].type == "reflective") {
            elements[i].drawMirror();
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

        var flag_canvas_interract = false;
        var current_ray = new Ray(rays[i].x, rays[i].y, rays[i].angle_deg);
        var new_ray = new Ray(rays[i].x, rays[i].y, rays[i].angle_deg);
        var count = 1

        while(flag_canvas_interract == false && count < 10) {
            console.log("1", current_ray, new_ray);

            var flag_interact = false;
            current_ray.closest_dist = 4000;
            var interacting_element;

            for(var j = 0; j < elements.length; j++) {
                if (current_ray.checkRayEqn(elements[j]) == false) {
                    console.log("checkRayEqn Failed by current ray", current_ray, "for element", elements[j]);
                    continue;
                }

                current_ray.findCoordinates(elements[j]);
                console.log("Current Ray Coordinates", current_ray);

                if(current_ray.checkCoordinates() == false) {
                    console.log("checkCoordinates Failed by current ray", current_ray, "for element", elements[j]);
                    continue;
                }
                if(current_ray.checkDistance()) {
                    new_ray.x = current_ray.new_x;
                    new_ray.y = current_ray.new_y;
                    interacting_element = elements[j];
                    flag_interact = true;
                }
            }

            if (flag_interact == true) {
                new_ray.findNewAngle(current_ray.angle_rad, current_ray.quad, interacting_element.angle_rad);
                new_ray.findQuadrant(); 
                console.log("New Ray", new_ray)
            }
            else {
                console.log("HIHI");
                current_ray.findBoundary();
                new_ray.x = current_ray.x_boundary;
                new_ray.y = current_ray.y_boundary;
                flag_canvas_interract = true;
                console.log("new ray", new_ray);
            }
            c.beginPath();
            c.lineWidth = 1;
            c.moveTo(current_ray.x, current_ray.y);
            c.lineTo(new_ray.x, new_ray.y);
            c.strokeStyle = "white";
            c.stroke();

            current_ray.x = new_ray.x;
            current_ray.y = new_ray.y;
            current_ray.angle_deg = new_ray.angle_deg;
            current_ray.findAngRad();
            current_ray.findSlope();
            current_ray.checkVertHorz();
            current_ray.findQuadrant();
            count += 1;
        }
    }
}

drawElements(rays, elements);