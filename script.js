const canvas = document.getElementById("simulationArea");
const c = canvas.getContext('2d');
let toolbarHeight = document.getElementById("toolbar").offsetHeight;
canvas.width = window.innerWidth - 5;
canvas.height = window.innerHeight - toolbarHeight - 5.1;

document.getElementById("addLightRay").addEventListener("click", function() {
    current_button = "add light ray";
    flag_begin_click = true;
});
document.getElementById("addLightBeam").addEventListener("click", function() {
    current_button = "add light beam";
    flag_begin_click = true;
});
document.getElementById("addRadialSource").addEventListener("click", function() {
    current_button = "add radial source";
});
document.getElementById("addFlatMirror").addEventListener("click", function() {
    current_button = "add flat mir";
    flag_begin_click = true;
});
document.getElementById("addCurvedMirror").addEventListener("click", function() {
    current_button = "add curved mir";
    flag_begin_click = true;
    flag_second_click = false;
});
document.getElementById("addFreeBody").addEventListener("click", function() {
    current_button = "add free body";
});
document.getElementById("moveObjects").addEventListener("click", function() {
    current_button = "move objects";
    move_type = "";
    move_12 = "";
    move_pos = null;
});
document.getElementById("showAnchorPoints").addEventListener("click", function() {
    flag_show_points = !flag_show_points;
    drawElements(rays, elements);
});
document.getElementById("ResetButton").addEventListener("click", function() {
    // current_button = "";
    rays = [];
    elements = [];
    ray_no = -1;
    el_no = -1;
    drawElements(rays, elements);
});

class refractiveBody {
    constructor(element_list, ref_index) {
        this.element_list = element_list;
        this.refract_index = ref_index;
        this.type = "refractive material";
        this.path;
        this.findPath();
        this.updatePathsOfElements();
        this.updateRefractIndex();
        this.draw();
    }
    findPath() {
        this.path = new Path2D();
        this.path.moveTo(this.element_list[0].x1, this.element_list[0].y1);
        for(let i = 0; i < this.element_list.length; i++) {
            this.path.lineTo(this.element_list[i].x2, this.element_list[i].y2);
        }
        this.path.closePath();
    }
    draw() {
        c.fillStyle = "rgba(255, 255, 255, 0.1)";
        c.fill(this.path);
    }
    updateRefractIndex() {
        for(let i = 0; i < this.element_list.length; i++) {
            this.element_list[i].ref_index = this.refract_index;
        }
    }
    updatePathsOfElements() {
        for(let i = 0; i < this.element_list.length; i++) {
            this.element_list[i].path = this.path;
        }
    }
    showPoints() {
        c.fillStyle = "red";
        for(let i = 0; i < this.element_list.length; i++) {
            c.fillRect(this.element_list[i].x1-4, this.element_list[i].y1-4, 8, 8);
        }
    }
}
class flatElement {
    constructor(x1_cord, y1_cord, x2_cord, y2_cord, element_type) {
        this.x1 = x1_cord;
        this.y1 = y1_cord;
        this.x2 = x2_cord;
        this.y2 = y2_cord;
        this.slope;
        this.angle_rad;
        this.flag_vert = false;
        this.flag_horz = false;
        this.surface = "flat";
        this.type = element_type;
        this.path;
        this.ref_index;
        this.draw();
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
    draw() {
        if(this.type === "reflective") {
            c.beginPath();
            c.lineWidth = 1;
            c.moveTo(this.x1, this.y1);
            c.lineTo(this.x2, this.y2);
            c.strokeStyle = "yellow";
            c.stroke();
        }
    }
    showPoints() {
        c.fillStyle = "red";
        c.fillRect(this.x1-4, this.y1-4, 8, 8);
        c.fillRect(this.x2-4, this.y2-4, 8, 8);
    }
    checkVertHorz() { 
        this.flag_vert = this.x1 === this.x2;
        this.flag_horz = this.y1 === this.y2;
    }
}
class curvedElement {
    constructor(x1_cord, y1_cord, x2_cord, y2_cord, x3_cord, y3_cord, element_type) {
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
        this.type = element_type;
        // this.angle_rad;
        // this.flag_vert = false;
        // this.flag_horz = false;
        this.findCenter();
        this.findRadius();
        this.findSlopes();
        this.findAngle();
        this.findAngles();
        this.checkDirection();
        this.draw();
        // this.checkVertHorz();

    }
    findCenter() {
        this.x_center = 0.5 * ((this.x1**2 + this.y1**2)*(this.y2-this.y3) + (this.x2**2 + this.y2**2)*(this.y3-this.y1) + (this.x3**2 + this.y3**2)*(this.y1-this.y2)) / (this.x1*(this.y2-this.y3) + this.x2*(this.y3-this.y1) + this.x3*(this.y1-this.y2));
        if(this.y3 === this.y2) {
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
        let ang;
        if(slope == null) {
            ang = Math.PI/2;
        }
        else {
            ang = Math.atan(slope);
        }
        if(ang < 0) {
            ang += Math.PI;
        }
        if(this.y_center < y || (y === this.y_center && x < this.x_center)) {
            ang += Math.PI;
        }
        return (2*Math.PI - ang);
    }
    findAngles() {
        this.start_ang = this.findAngle(this.slope2, this.x2, this.y2);
        this.mid_ang = this.findAngle(this.slope3, this.x3, this.y3);
        this.end_ang = this.findAngle(this.slope1, this.x1, this.y1);
    }
    checkDirection() {
        this.direction = this.findDirection(this.start_ang, this.mid_ang, this.end_ang);
    }
    findDirection(start_ang, mid_ang, end_ang) {
        return (mid_ang < start_ang && start_ang < end_ang) || (start_ang < end_ang && end_ang < mid_ang) || (end_ang < mid_ang && mid_ang < start_ang);
    }
    draw() {
        c.beginPath();
        c.lineWidth = 1;
        c.arc(this.x_center, this.y_center, this.radius, this.start_ang, this.end_ang, this.direction)
        c.strokeStyle = "yellow";
        c.stroke();
    }
    checkVertHorz() {
        if(this.x1 === this.x2) {
            this.flag_vert = true;
        }
        if(this.y1 === this.y2) {
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
    checkVertHorz() {
        this.flag_vert = this.angle_rad === (0.5 * Math.PI) || this.angle_rad === (1.5 * Math.PI);

        this.flag_horz = this.angle_rad === 0 || this.angle_rad === Math.PI;
    }
    rayEqn(x, y) {
        return (this.slope*(x - this.x) + y - this.y)
    }
    checkRayFlatSurfaceIntersection(element) {
        if(this.rayEqn(element.x1, element.y1) * this.rayEqn(element.x2, element.y2) < 0) {
            return true;
        }
        else if(this.rayEqn(element.x1, element.y1) * this.rayEqn(element.x2, element.y2) === 0) {
            return !(this.rayEqn(element.x1, element.y1) === 0 && this.rayEqn(element.x2, element.y2) === 0);
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
        let flag_ray_dir = false;
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
        if(this.angle_rad === 0.5*Math.PI) {
            this.x_boundary = this.x;
            this.y_boundary = 0;
        }
        else if(this.angle_rad === 1.5*Math.PI) {
            this.x_boundary = this.x;
            this.y_boundary = canvas.height;
        }
        else if(this.angle_rad === 0) {
            this.x_boundary = canvas.width;
            this.y_boundary = this.y;
        }
        else if(this.angle_rad === Math.PI) {
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
        if(Math.sqrt(Math.pow((new_x - x), 2) + Math.pow((new_y - y), 2)) < 0.5) {
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
    findReflectAngle(ray_angle, quad, mir_angle) {
        if(mir_angle <= 0) {
            mir_angle += Math.PI;
        }
        if(quad === 3 || quad === 4) {
            mir_angle += Math.PI;
        }
        this.angle_rad = ray_angle + 2*(mir_angle - ray_angle);
        this.angle_rad %= (2*Math.PI);
        if(this.angle_rad < 0) {
            this.angle_rad += 2*Math.PI;
        }
    }
    findRefractAngle(ray_angle, quad, mir_angle, flag_inside, ref_ind) {
        let cpy_mir = mir_angle;
        let cpy_ray = ray_angle;
        let cpy_new_ray;
        let cpy_dif;
        let cpy_dir;
        if(cpy_mir <= 0) {
            cpy_mir += Math.PI;
        }
        if(quad === 3 || quad === 4) {
            cpy_mir += Math.PI;
        }
        cpy_new_ray = cpy_ray + 2*(cpy_mir - cpy_ray);
        cpy_new_ray %= (2*Math.PI);
        if(cpy_new_ray < 0) {
            cpy_new_ray += 2*Math.PI;
        }
        cpy_dif = cpy_ray - cpy_new_ray;
        if(Math.abs(cpy_dif) > Math.PI) {
            cpy_dif *= -1;
        }
        cpy_dir = Math.abs(cpy_dif) / cpy_dif;

        let ref_dif = Math.abs(mir_angle - ray_angle) % Math.PI;
        let incident_ang = Math.abs(0.5*Math.PI - ref_dif);
        let refracted_ang = Math.abs(Math.asin(Math.cos(ref_dif) / ref_ind));
        let critical_ang = Math.asin(1/ref_ind);
        let ref_change = incident_ang - refracted_ang;
        console.log("Incident Angle :", incident_ang);
        console.log("Refracted Angle :", refracted_ang);
        console.log("Angle Deviation :", ref_change);
        console.log("Sign of angle change :", cpy_dir);

        if(flag_inside) {
            if(incident_ang > critical_ang) {
                this.angle_rad = ray_angle + 2*(mir_angle - ray_angle);
            }
            else {
                this.angle_rad = ray_angle - cpy_dir*(ref_change);
            }
        }
        else {
            this.angle_rad = ray_angle + cpy_dir*(ref_change);
        }
        this.angle_rad %= (2*Math.PI);
        if(this.angle_rad < 0) {
            this.angle_rad += 2*Math.PI;
        }
        this.angle_rad %= (2*Math.PI);
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
    showPoints() {
        c.fillStyle = "red";
        c.fillRect(this.x-4, this.y-4, 8, 8);
        c.fillRect(this.dir_x-4, this.dir_y-4, 8, 8);
    }
}

function findAngle(x1, y1, x2, y2) {
    let angle_temp;
    let slope_temp = (y1 - y2) / (x2 - x1);

    if(slope_temp == null) {
        angle_temp = 0.5*Math.PI;
    }
    else {
        angle_temp = Math.atan(slope_temp);
    }
    if(angle_temp < 0) {
        angle_temp += Math.PI;
    }
    if(y1 < y2 || (y2 === y1 && x2 < x1)) {
        angle_temp += Math.PI;
    }

    return angle_temp;
}
function getCursorPosition(canvas, event) {
    // console.log(event);
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    // console.log("x: " + x + " y: " + y)
    return([x, y]);
}
function mouseMove(ev) {
    let mouse_xy = getCursorPosition(canvas, ev);
    let x_cord = mouse_xy[0];
    let y_cord = mouse_xy[1];

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
            // console.log(JSON.stringify(rays, null, 4), JSON.stringify(elements, null, 4));
            drawElements(rays, elements);

            c.fillStyle = "red";
            c.fillRect(elements[el_no].x1-4, elements[el_no].y1-4, 8, 8);
            c.fillRect(mouse_xy[0]-4, mouse_xy[1]-4, 8, 8);
            break;
        case "add curved mir":
            if(flag_second_click) {
                elements[el_no].x2 = mouse_xy[0];
                elements[el_no].y2 = mouse_xy[1];
            }
            else {
                elements[el_no].x3 = mouse_xy[0];
                elements[el_no].y3 = mouse_xy[1];
            }
            elements[el_no].findCenter();
            elements[el_no].findRadius();
            elements[el_no].findSlopes();
            elements[el_no].findAngle();
            elements[el_no].findAngles();
            elements[el_no].checkDirection();

            // console.log(JSON.stringify(rays, null, 4), JSON.stringify(elements, null, 4));
            drawElements(rays, elements);

            c.fillStyle = "red";
            c.fillRect(elements[el_no].x1-4, elements[el_no].y1-4, 8, 8);
            c.fillRect(elements[el_no].x2-4, elements[el_no].y2-4, 8, 8);
            c.fillRect(elements[el_no].x3-4, elements[el_no].y3-4, 8, 8);
            break;
        case "move objects":
            if(move_type === "ray") {
                // console.log("Mouse move Ray", mouse_xy, move_12, move_pos, move_type);
                if(move_12 === "1") {
                    rays[move_pos].x = x_cord;
                    rays[move_pos].y = y_cord;
                }
                else if(move_12 === "2") {
                    rays[move_pos].dir_x = x_cord;
                    rays[move_pos].dir_y = y_cord;
                }
                rays[move_pos].angle_rad = findAngle(rays[move_pos].x, rays[move_pos].y, rays[move_pos].dir_x, rays[move_pos].dir_y);
                rays[move_pos].findSlope();
                rays[move_pos].findQuadrant();
                rays[move_pos].checkVertHorz();

                // console.log("Mouse Move Ray", move_type, move_12, move_pos, JSON.stringify(rays[move_pos], null, 4));
                drawElements(rays, elements);

                c.fillStyle = "red";
                c.fillRect(rays[move_pos].x-4, rays[move_pos].y-4, 8, 8);
                c.fillRect(rays[move_pos].dir_x-4, rays[move_pos].dir_y-4, 8, 8);
            }
            else if(move_type === "element") {
                if(elements[move_pos].surface === "flat") {
                    if(move_12 === "1") {
                        elements[move_pos].x1 = x_cord;
                        elements[move_pos].y1 = y_cord;
                    }
                    else if(move_12 === "2") {
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
                else if(elements[move_pos].surface === "curved") {
                    if(move_12 === "1") {
                        elements[move_pos].x1 = x_cord;
                        elements[move_pos].y1 = y_cord;
                    }
                    else if(move_12 === "2") {
                        elements[move_pos].x2 = x_cord;
                        elements[move_pos].y2 = y_cord;
                    }
                    else if(move_12 === "3") {
                        elements[move_pos].x3 = x_cord;
                        elements[move_pos].y3 = y_cord;
                    }
                    elements[move_pos].findCenter();
                    elements[move_pos].findRadius();
                    elements[move_pos].findSlopes();
                    elements[move_pos].findAngle();
                    elements[move_pos].findAngles();
                    elements[move_pos].checkDirection();

                    drawElements(rays, elements);

                    c.fillStyle = "red";
                    c.fillRect(elements[move_pos].x1-4, elements[move_pos].y1-4, 8, 8);
                    c.fillRect(elements[move_pos].x2-4, elements[move_pos].y2-4, 8, 8);
                    c.fillRect(elements[move_pos].x3-4, elements[move_pos].y3-4, 8, 8);
                }
            }
            break;
    }
}
function drawElements(rays, elements) {
    let curved_mir_slope;
    let temp_mid_ang;
    let coordinates;
    let interacting_element;

    // console.log("drawElements");
    c.clearRect(0, 0, canvas.width, canvas.height);
    // drawing Each Reflective and Refractive Surface
    if(flag_show_points) {
        for(let i = 0; i < elements.length; i++) {
            elements[i].showPoints();
        }
        for(let i = 0; i < rays.length; i++) {
            rays[i].showPoints();
        }
    }
    for(let i = 0; i < elements.length; i++) {
        elements[i].draw();
    }
    // drawing Each Ray
    for(let i = 0; i < rays.length; i++) {
        // rays[i].showPoints();
        let flag_canvas_interact = false;
        let current_ray = new Ray(rays[i].x, rays[i].y, rays[i].angle_rad);
        let new_ray = new Ray(rays[i].x, rays[i].y, rays[i].angle_rad);
        let count = 1;
        // console.log(JSON.stringify(rays[i], null, 4))
        while(flag_canvas_interact === false && count < 200) {
            let flag_interact = false;
            interacting_element = null;
            for(let j = 0; j < elements.length; j++) {
                // console.log("i = ", i, "j = ", j, "\nCurrent: ", JSON.stringify(current_ray, null, 4), "\nNew: ", JSON.stringify(new_ray, null, 4), "\nElement: ", JSON.stringify(elements[j], null, 4));
                if(elements[j].type === "refractive material") {
                    for(let k = 0; k < elements[j].element_list.length; k++) {
                        if(elements[j].element_list[k].surface === "flat") {
                            // console.log("Flat Element");
                            if (current_ray.checkRayFlatSurfaceIntersection(elements[j].element_list[k]) === false) {
                                // console.log("checkRayEqn Failed by current ray", JSON.stringify(current_ray, null, 4), "for element", JSON.stringify(elements[j], null, 4));
                                continue;
                            }
                            current_ray.findFlatSurfaceCoordinates(elements[j].element_list[k]);
                            console.log("Current Ray Coordinates", JSON.stringify(current_ray, null, 4));
                            if(current_ray.checkCoordinatesDirection(current_ray.new_x, current_ray.new_y) === false) {
                                // console.log("checkCoordinatesDirection Failed by current ray", current_ray, "for element", elements[j]);
                                continue;
                            }
                            if(current_ray.checkDistance(current_ray.x, current_ray.y, current_ray.new_x, current_ray.new_y)) {
                                new_ray.x = current_ray.new_x;
                                new_ray.y = current_ray.new_y;
                                interacting_element = elements[j].element_list[k];
                                flag_interact = true;
                            }
                            else {
                                // console.log("Check Distance Failed");
                            }
                        }
                        else if(elements[j].element_list[k].surface === "curved") {
                            // console.log("Curved Element");
                            current_ray.findABCDE(elements[j].element_list[k].x_center, elements[j].element_list[k].y_center, elements[j].element_list[k].radius);
                            if(current_ray.D <= 0){
                                // console.log("Failed as Determinant <= zero", current_ray.A, current_ray.B, current_ray.C, current_ray.D);
                                continue;
                            }
                            coordinates = current_ray.findCurvedPointsOfIntersection();
                            // console.log("Current Ray Coordinates", JSON.stringify(coordinates));
                            for(let l = 0; l < 2; l++) {
                                if(current_ray.checkCoordinatesDirection(coordinates[l][0], coordinates[l][1]) === false) {
                                    // console.log("checkCoordinatesDirection Failed by Point", coordinates[k][0], coordinates[k][1], "for element", JSON.stringify(elements[j], null, 4));
                                    current_ray.flag_AB[l] = false;
                                    continue;
                                }
                                temp_mid_ang = findAngle(elements[j].element_list[k].x_center, elements[j].element_list[k].y_center, coordinates[l][0], coordinates[l][1]);
                                temp_mid_ang = (2*Math.PI - temp_mid_ang)
                                // console.log(temp_mid_ang, elements[j].direction, elements[j].findDirection(elements[j].start_ang, temp_mid_ang, elements[j].end_ang));
                                if(elements[j].element_list[k].findDirection(elements[j].element_list[k].start_ang, temp_mid_ang, elements[j].element_list[k].end_ang) !== elements[j].element_list[k].direction) {
                                    // console.log("Coordinates in Curved Mirror surface Failed by Point", coordinates[k][0], coordinates[k][1], "for element", JSON.stringify(elements[j], null, 4));
                                    current_ray.flag_AB[l] = false;
                                    continue;
                                }
                                if(current_ray.checkDistance(current_ray.x, current_ray.y, coordinates[l][0], coordinates[l][1])) {
                                    new_ray.x = coordinates[l][0];
                                    new_ray.y = coordinates[l][1];
                                    interacting_element = elements[j].element_list[k];
                                    curved_mir_slope = interacting_element.findTangentSlopeAtCoordinate(new_ray.x, new_ray.y);
                                    interacting_element.angle_rad = Math.atan(curved_mir_slope);
                                    flag_interact = true;
                                }
                                else {
                                    // console.log("Check Distance Failed");
                                }
                            }
                        }
                    }
                }
                else {
                    if(elements[j].surface === "flat") {
                        // console.log("Flat Element");
                        if (current_ray.checkRayFlatSurfaceIntersection(elements[j]) === false) {
                            // console.log("checkRayEqn Failed by current ray", JSON.stringify(current_ray, null, 4), "for element", JSON.stringify(elements[j], null, 4));
                            continue;
                        }
                        current_ray.findFlatSurfaceCoordinates(elements[j]);
                        // console.log("Current Ray Coordinates", JSON.stringify(current_ray, null, 4));
                        if(current_ray.checkCoordinatesDirection(current_ray.new_x, current_ray.new_y) === false) {
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
                    else if(elements[j].surface === "curved") {
                        // console.log("Curved Element");
                        current_ray.findABCDE(elements[j].x_center, elements[j].y_center, elements[j].radius);
                        if(current_ray.D <= 0){
                            // console.log("Failed as Determinant <= zero", current_ray.A, current_ray.B, current_ray.C, current_ray.D);
                            continue;
                        }
                        coordinates = current_ray.findCurvedPointsOfIntersection();
                        // console.log("Current Ray Coordinates", JSON.stringify(coordinates));
                        for(let k = 0; k < 2; k++) {
                            if(current_ray.checkCoordinatesDirection(coordinates[k][0], coordinates[k][1]) === false) {
                                // console.log("checkCoordinatesDirection Failed by Point", coordinates[k][0], coordinates[k][1], "for element", JSON.stringify(elements[j], null, 4));
                                current_ray.flag_AB[k] = false;
                                continue;
                            }
                            temp_mid_ang = findAngle(elements[j].x_center, elements[j].y_center, coordinates[k][0], coordinates[k][1]);
                            temp_mid_ang = (2*Math.PI - temp_mid_ang)
                            // console.log(temp_mid_ang, elements[j].direction, elements[j].findDirection(elements[j].start_ang, temp_mid_ang, elements[j].end_ang));
                            if(elements[j].findDirection(elements[j].start_ang, temp_mid_ang, elements[j].end_ang) !== elements[j].direction) {
                                // console.log("Coordinates in Curved Mirror surface Failed by Point", coordinates[k][0], coordinates[k][1], "for element", JSON.stringify(elements[j], null, 4));
                                current_ray.flag_AB[k] = false;
                                continue;
                            }
                            if(current_ray.checkDistance(current_ray.x, current_ray.y, coordinates[k][0], coordinates[k][1 ])) {
                                new_ray.x = coordinates[k][0];
                                new_ray.y = coordinates[k][1];
                                interacting_element = elements[j];
                                curved_mir_slope = interacting_element.findTangentSlopeAtCoordinate(new_ray.x, new_ray.y);
                                interacting_element.angle_rad = Math.atan(curved_mir_slope);
                                flag_interact = true;
                            }
                            else {
                                // console.log("Check Distance Failed");
                            }
                        }
                    }
                }
            }
            if (flag_interact === true) {
                // console.log("New Ray Before Interaction \nCurrent: ", JSON.stringify(current_ray, null, 4), "\nNew: ", JSON.stringify(new_ray, null, 4), "\nElement: ", JSON.stringify(interacting_element, null, 4));
                if(interacting_element.type === "reflective") {
                    new_ray.findReflectAngle(current_ray.angle_rad, current_ray.quad, interacting_element.angle_rad);
                }
                else {
                    let flag_inside = c.isPointInPath(interacting_element.path, (new_ray.x + current_ray.x)/2, (new_ray.y + current_ray.y)/2 );
                    // console.log("Initial point : ", current_ray.x, current_ray.y, "\n Final Point : ", new_ray.x, new_ray.y);
                    // console.log("Interacting Element", JSON.stringify(interacting_element, null, 4));
                    // console.log("Is Ray coming from Inside : ", flag_inside, "Ray midpoint", (new_ray.x + current_ray.x)/2, (new_ray.y + current_ray.y)/2);
                    new_ray.findRefractAngle(current_ray.angle_rad, current_ray.quad, interacting_element.angle_rad, flag_inside, interacting_element.ref_index);
                }
                new_ray.findQuadrant();
                // console.log("New Ray After Interaction ", JSON.stringify(new_ray, null, 4))
            }
            else {
                current_ray.findBoundaryCoordinates();
                new_ray.x = current_ray.x_boundary;
                new_ray.y = current_ray.y_boundary;
                flag_canvas_interact = true;
                // console.log("new ray", new_ray);
            }
            c.beginPath();
            c.lineWidth = 1;
            c.moveTo(current_ray.x, current_ray.y);
            c.lineTo(new_ray.x, new_ray.y);
            // console.log(rays[i].color);
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

//["curved_mir", 650, 550, 1050, 550, 850, 350], ["flat_mir", 800, 600, 1200, 600]
// let temp_mir = [[800, 600, 1200, 600], [1200, 600, 1200, 500], [1200, 500, 800, 500], [800, 500, 800, 600]];
// let temp_ray = [[1250, 693, 0, "red"]];
// let temp_sub_elem = [];
// for(let i = 0; i < temp_mir.length; i++) {
//     // console.log("Creating Objects of the Elements");
//     if(temp_mir[i][0] === "flat_mir") {
//         elements[i] = new flatElement(temp_mir[i][1], temp_mir[i][2], temp_mir[i][3], temp_mir[i][4], "reflective");
//     }
//     else if(temp_mir[i][0] === "curved_mir") {
//         elements[i] = new curvedElement(temp_mir[i][1], temp_mir[i][2], temp_mir[i][3], temp_mir[i][4], temp_mir[i][5], temp_mir[i][6], "reflective");
//     }
//     else{
//         temp_sub_elem.push(new flatElement(temp_mir[i][0], temp_mir[i][1], temp_mir[i][2], temp_mir[i][3]));
//     }
// }
// elements.push(new refractiveBody(temp_sub_elem, 1.5));
// for(let i = 0; i < temp_ray.length; i++) {
//     // console.log("Creating Objects of the Elements");
//     rays.push(new Ray(temp_ray[i][0], temp_ray[i][1], temp_ray[i][2], temp_ray[i][3]));
//     rays[i].dir_x = 1119;
//     rays[i].dir_y = 635;
//     rays[i].angle_rad = findAngle(rays[i].x, rays[i].y, rays[i].dir_x, rays[i].dir_y);
// }
let elements = [];
let rays = [];
let ray_no = -1;
let el_no = -1;
let custom_shape = [];
let flag_show_points = true;
let flag_begin_click = true;
let flag_second_click = false;
let current_button = "";
let move_12 = "";
let move_type = "";
let move_pos = null;
let flag_ray_move = false;
let flag_el_move = false;
let refract_index = 1.5;

canvas.addEventListener('click',
    function(e) {
        let xy = getCursorPosition(canvas, e);
        let x_cord = xy[0];
        let y_cord = xy[1];

        switch(current_button) {
            case "add light ray":
                if(flag_begin_click) {
                    console.log('Ray Begin mouse click', x_cord, y_cord);
                    rays.push(new Ray(x_cord, y_cord, 0, "yellow"));
                    ray_no += 1;
                    flag_begin_click = false;
                    canvas.addEventListener('mousemove', mouseMove);
                }
                else {
                    console.log('Ray End Mouse click', x_cord, y_cord);
                    rays[ray_no].dir_x = x_cord;
                    rays[ray_no].dir_y = y_cord;
                    rays[ray_no].angle_rad = findAngle(rays[ray_no].x, rays[ray_no].y, rays[ray_no].dir_x, rays[ray_no].dir_y);
                    rays[ray_no].findSlope();
                    rays[ray_no].findQuadrant();
                    rays[ray_no].checkVertHorz();
                    flag_begin_click = true;
                    canvas.removeEventListener("mousemove", mouseMove);

                    drawElements(rays, elements);
                    console.log("End Click Ray", JSON.stringify(rays, null, 4), ray_no);

                    c.fillStyle = "red";
                    c.fillRect(rays[ray_no].x-4, rays[ray_no].y-4, 8, 8);
                    c.fillRect(x_cord-4, y_cord-4, 8, 8);
                }
                break;
            // case "add light beam":
            //     if(flag_begin_click) {
            //         console.log('Ray Beam Begin mouse click', x_cord, y_cord);
            //         rays.push(new Ray(x_cord, y_cord, 0, "yellow"));
            //         ray_no += 1;
            //         flag_begin_click = false;
            //         canvas.addEventListener('mousemove', mouseMove);
            //     }
            //     else {
            //         console.log('Ray End Mouse click', x_cord, y_cord);
            //         rays[ray_no].dir_x = x_cord;
            //         rays[ray_no].dir_y = y_cord;
            //         rays[ray_no].angle_rad = findAngle(rays[ray_no].x, rays[ray_no].y, rays[ray_no].dir_x, rays[ray_no].dir_y);
            //         rays[ray_no].findSlope();
            //         rays[ray_no].findQuadrant();
            //         rays[ray_no].checkVertHorz();
            //         flag_begin_click = true;
            //         canvas.removeEventListener("mousemove", mouseMove);
            //
            //         drawElements(rays, elements);
            //         console.log("End Click Ray", JSON.stringify(rays, null, 4), ray_no);
            //
            //         c.fillStyle = "red";
            //         c.fillRect(rays[ray_no].x-4, rays[ray_no].y-4, 8, 8);
            //         c.fillRect(x_cord-4, y_cord-4, 8, 8);
            //     }
            //     break;

            // case "add radial source":
            //     console.log('Ray Beam Begin mouse click', x_cord, y_cord);
            //     rays.push(new Ray(x_cord, y_cord, 0, "yellow"));
            //     ray_no += 1;
            //     flag_begin_click = false;
            //     canvas.addEventListener('mousemove', mouseMove);
            //     break;
            case "add flat mir":
                if(flag_begin_click) {
                    // console.log('Flat Mir Begin mouse click', x_cord, y_cord);
                    elements.push(new flatElement(x_cord, y_cord, x_cord, y_cord, "reflective"));
                    el_no += 1;
                    flag_begin_click = false;
                    canvas.addEventListener('mousemove', mouseMove);
                }
                else {
                    // console.log('Flat Mir End Mouse click', x_cord, y_cord);
                    elements[el_no].x2 = x_cord;
                    elements[el_no].y2 = y_cord;
                    elements[el_no].checkVertHorz();
                    elements[el_no].findSlope();
                    elements[el_no].findAngRad();
                    flag_begin_click = true;
                    canvas.removeEventListener("mousemove", mouseMove);
                    drawElements(rays, elements);
                    c.fillStyle = "red";
                    c.fillRect(elements[el_no].x1-4, elements[el_no].y1-4, 8, 8);
                    c.fillRect(x_cord-4, y_cord-4, 8, 8);
                }
                break;
            case "add curved mir":
                if(flag_begin_click) {
                    console.log('Curved Mir first mouse click', x_cord, y_cord);
                    elements.push(new curvedElement(x_cord, y_cord, x_cord, y_cord, x_cord, y_cord, "reflective"));
                    el_no += 1;
                    flag_begin_click = false;
                    flag_second_click = true;
                    c.fillStyle = "red";
                    c.fillRect(x_cord-4, y_cord-4, 8, 8);
                    canvas.addEventListener('mousemove', mouseMove);
                }
                else if(flag_second_click) {
                    console.log('Curved Mir Second Mouse click', x_cord, y_cord);
                    elements[el_no].x2 = x_cord;
                    elements[el_no].y2 = y_cord;
                    elements[el_no].findCenter();
                    elements[el_no].findRadius();
                    elements[el_no].findSlopes();
                    elements[el_no].findAngle();
                    elements[el_no].findAngles();
                    elements[el_no].checkDirection();
                    flag_second_click = false;
                    drawElements(rays, elements);
                    c.fillStyle = "red";
                    c.fillRect(elements[el_no].x1-4, elements[el_no].y1-4, 8, 8);
                    c.fillRect(elements[el_no].x2-4, elements[el_no].y2-4, 8, 8);
                }
                else {
                    console.log('Curved Mir Second Mouse click', x_cord, y_cord);
                    elements[el_no].x3 = x_cord;
                    elements[el_no].y3 = y_cord;
                    elements[el_no].findCenter();
                    elements[el_no].findRadius();
                    elements[el_no].findSlopes();
                    elements[el_no].findAngle();
                    elements[el_no].findAngles();
                    elements[el_no].checkDirection();
                    flag_begin_click = true;
                    canvas.removeEventListener("mousemove", mouseMove);
                    drawElements(rays, elements);
                    c.fillStyle = "red";
                    c.fillRect(elements[el_no].x1-4, elements[el_no].y1-4, 8, 8);
                    c.fillRect(elements[el_no].x2-4, elements[el_no].y2-4, 8, 8);
                    c.fillRect(elements[el_no].x3-4, elements[el_no].y3-4, 8, 8);
                }
                break;
            case "add free body":
                if(flag_begin_click) {
                    // console.log('first mouse click', x_cord, y_cord);
                    custom_shape.push(xy);
                    flag_begin_click = false;
                    c.fillStyle = "red";
                    c.fillRect(x_cord-4, y_cord-4, 8, 8);
                }
                else if(Math.abs(x_cord - custom_shape[0][0]) <=7  && Math.abs(y_cord - custom_shape[0][1]) <=7) {
                    // console.log('Final Mouse click', x_cord, y_cord);
                    custom_shape.push([custom_shape[0][0], custom_shape[0][1]]);
                    // console.log(custom_shape);
                    let refract_arr = [];
                    for(let i = 0; i < (custom_shape.length - 1); i++) {
                        refract_arr.push(new flatElement(custom_shape[i][0], custom_shape[i][1], custom_shape[i+1][0], custom_shape[i+1][1], "refractive"));
                    }
                    elements.push(new refractiveBody(refract_arr, refract_index));
                    drawElements(rays, elements);
                    custom_shape = [];
                    refract_arr = [];
                    flag_begin_click = true;
                }
                else {
                    console.log('Mouse click', x_cord, y_cord);
                    custom_shape.push(xy);
                    c.fillStyle = "red";
                    c.fillRect(x_cord-4, y_cord-4, 8, 8);
                }
                break;
        }
    })
canvas.addEventListener("mousedown", 
    function(e) {
        let xy = getCursorPosition(canvas, e);
        let x_cord = xy[0];
        let y_cord = xy[1];
        // console.log("Mouse Down", xy);
        
        switch(current_button) {
            case "move objects":
                console.log("Entered Move Objects in Mouse Down", JSON.stringify(rays, null, 4), JSON.stringify(elements, null, 4));
                for(let i = 0; i < rays.length; i++) {
                    if(Math.abs(x_cord - rays[i].x) <= 7  && Math.abs(y_cord - rays[i].y) <= 7) {
                        rays[i].x = x_cord;
                        rays[i].y = y_cord;
                        move_12 = "1";
                        flag_ray_move = true;
                    }
                    else if(Math.abs(x_cord - rays[i].dir_x) <= 7  && Math.abs(y_cord - rays[i].dir_y) <= 7) {
                        rays[i].dir_x = x_cord;
                        rays[i].dir_y = y_cord;
                        move_12 = "2";
                        flag_ray_move = true;
                    }
                    if(flag_ray_move) {
                        move_pos = i;
                        move_type = "ray";
                        rays[i].angle_rad = findAngle(rays[i].x, rays[i].y, rays[i].dir_x, rays[i].dir_y);
                        rays[i].findSlope();
                        rays[i].findQuadrant();
                        rays[i].checkVertHorz();
                        // console.log("Mouse Down Ray", move_type, move_12, move_pos, JSON.stringify(rays[i], null, 4));
                        canvas.addEventListener('mousemove', mouseMove);
                        break;
                    }
                }
                for(let i = 0; i < elements.length; i++) {
                    if(elements[i].surface === "flat") {
                        if(Math.abs(x_cord - elements[i].x1) <= 7  && Math.abs(y_cord - elements[i].y1) <= 7) {
                            elements[i].x1 = x_cord;
                            elements[i].y1 = y_cord;
                            move_12 = "1";
                            flag_el_move = true;
                        }
                        else if(Math.abs(x_cord - elements[i].x2) <= 7  && Math.abs(y_cord - elements[i].y2) <= 7) {
                            elements[i].x2 = x_cord;
                            elements[i].y2 = y_cord;
                            move_12 = "2";
                            flag_el_move = true;
                        }
                        if(flag_el_move) {
                            move_pos = i;
                            move_type = "element";
                            elements[i].checkVertHorz();
                            elements[i].findSlope();
                            elements[i].findAngRad();
                            // console.log("Mouse Down Flat Element", move_type, move_12, move_pos, JSON.stringify(elements[i], null, 4));
                            canvas.addEventListener('mousemove', mouseMove);
                            break;
                        }
                    }
                    else if(elements[i].surface === "curved"){
                        if(Math.abs(x_cord - elements[i].x1) <= 7  && Math.abs(y_cord - elements[i].y1) <= 7) {
                            elements[i].x1 = x_cord;
                            elements[i].y1 = y_cord;
                            move_12 = "1";
                            flag_el_move = true;
                        }
                        else if(Math.abs(x_cord - elements[i].x2) <= 7  && Math.abs(y_cord - elements[i].y2) <= 7) {
                            elements[i].x2 = x_cord;
                            elements[i].y2 = y_cord;
                            move_12 = "2";
                            flag_el_move = true;
                        }
                        else if(Math.abs(x_cord - elements[i].x3) <= 7  && Math.abs(y_cord - elements[i].y3) <= 7) {
                            elements[i].x3 = x_cord;
                            elements[i].y3 = y_cord;
                            move_12 = "3";
                            flag_el_move = true;
                        }
                        if(flag_el_move) {
                            move_pos = i;
                            move_type = "element";
                            elements[i].findCenter();
                            elements[i].findRadius();
                            elements[i].findSlopes();
                            elements[i].findAngle();
                            elements[i].findAngles();
                            elements[i].checkDirection();
                            // console.log("Mouse Down Flat Element", move_type, move_12, move_pos, JSON.stringify(elements[i], null, 4));
                            canvas.addEventListener('mousemove', mouseMove);
                            break;
                        }
                    }
                }
                break;
        }
    })
canvas.addEventListener("mouseup", 
    function(e) {
        let xy = getCursorPosition(canvas, e);
        let x_cord = xy[0];
        let y_cord = xy[1];
        // console.log("Mouse Up", xy);
        
        switch(current_button) {
            case "move objects":
                console.log("Entered Move Objects in Up", JSON.stringify(rays, null, 4), JSON.stringify(elements, null, 4));
                if(flag_ray_move) {
                    if(move_12 === "1") {
                        rays[move_pos].x = x_cord;
                        rays[move_pos].y = y_cord;
                    }
                    else if(move_12 === "2") {
                        rays[move_pos].dir_x = x_cord;
                        rays[move_pos].dir_y = y_cord;
                    }
                    rays[move_pos].angle_rad = findAngle(rays[move_pos].x, rays[move_pos].y, rays[move_pos].dir_x, rays[move_pos].dir_y);
                    rays[move_pos].findSlope();
                    rays[move_pos].findQuadrant();
                    rays[move_pos].checkVertHorz();

                    canvas.removeEventListener("mousemove", mouseMove);
                    drawElements(rays, elements);

                    c.fillStyle = "red";
                    c.fillRect(rays[move_pos].x-4, rays[move_pos].y-4, 8, 8);
                    c.fillRect(rays[move_pos].dir_x-4, rays[move_pos].dir_y-4, 8, 8);
                    // console.log("Mouse Up Ray", move_type, move_12, move_pos, JSON.stringify(rays[move_pos], null, 4));

                    move_12 = "";
                    move_type = "";
                    move_pos = null;
                    flag_ray_move = false;
                }
                else if(flag_el_move) {
                    if(elements[move_pos].surface === "flat") {
                        if(move_12 === "1") {
                            elements[move_pos].x1 = x_cord;
                            elements[move_pos].y1 = y_cord;
                        }
                        else if(move_12 === "2") {
                            elements[move_pos].x2 = x_cord;
                            elements[move_pos].y2 = y_cord;
                        }
                        elements[move_pos].checkVertHorz();
                        elements[move_pos].findSlope();
                        elements[move_pos].findAngRad();
                        
                        canvas.removeEventListener("mousemove", mouseMove);
                        drawElements(rays, elements);

                        c.fillStyle = "red";
                        c.fillRect(elements[move_pos].x1-4, elements[move_pos].y1-4, 8, 8);
                        c.fillRect(elements[move_pos].x2-4, elements[move_pos].y2-4, 8, 8);
                        // console.log("Mouse Up Ray", move_type, move_12, move_pos, JSON.stringify(rays[move_pos], null, 4));
                        move_12 = "";
                        move_type = "";
                        move_pos = null;
                        flag_el_move = false;
                    }
                    else if(elements[move_pos].surface === "curved") {
                        if(move_12 === "1") {
                            elements[move_pos].x1 = x_cord;
                            elements[move_pos].y1 = y_cord;
                        }
                        else if(move_12 === "2") {
                            elements[move_pos].x2 = x_cord;
                            elements[move_pos].y2 = y_cord;
                        }
                        else if(move_12 === "3") {
                            elements[move_pos].x3 = x_cord;
                            elements[move_pos].y3 = y_cord;
                        }
                        elements[move_pos].findCenter();
                        elements[move_pos].findRadius();
                        elements[move_pos].findSlopes();
                        elements[move_pos].findAngle();
                        elements[move_pos].findAngles();
                        elements[move_pos].checkDirection();

                        canvas.removeEventListener("mousemove", mouseMove);
                        drawElements(rays, elements);

                        c.fillStyle = "red";
                        c.fillRect(elements[move_pos].x1-4, elements[move_pos].y1-4, 8, 8);
                        c.fillRect(elements[move_pos].x2-4, elements[move_pos].y2-4, 8, 8);
                        c.fillRect(elements[move_pos].x3-4, elements[move_pos].y3-4, 8, 8);

                        move_12 = "";
                        move_type = "";
                        move_pos = null;
                        flag_el_move = false;
                    }
                }
                break;
            case "add free body":
                break;
        }
    })

// console.log(JSON.stringify(rays, null, 4), JSON.stringify(elements, null, 4));
// drawElements(rays, elements)