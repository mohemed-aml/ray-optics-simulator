var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 59;

var c = canvas.getContext('2d');

// var mirrors = [[700, 350, 700, 450], [1050, 100, 1050, 400], [400, 150, 600, 150], [425, 200, 475, 264]];
// var rays = [[600, 500, 50, 0, "white"], [750, 0, 330, 0, "white"]];
// [750, 0, 330, 0]
var mirrors = [[1050, 550, 1050, 350], [950, 250, 750, 250], [650, 350, 650, 550], [750, 650, 950, 650]]
var rays = [[800, 300, 44.92, 1, "yellow"], [900, 300, 135.08, 2, "blue"]]

for(var i = 0; i < mirrors.length; i++) {
  c.beginPath();
  c.lineWidth = 3;
  c.moveTo(mirrors[i][0], mirrors[i][1]);
  c.lineTo(mirrors[i][2], mirrors[i][3]);
  c.strokeStyle = "yellow";
  c.stroke();
}

for(var r = 0; r < rays.length; r++) {

  console.log("Ray ", (r+1));
  // mir_interact = [x-cord, y-cord, angle of the mirror] 
  // mir_interact hold the position data of the closest element that the ray will interact with, 
  // thus it is initialized with the values of the canvas edges
  // and then the ray is compared against all the other mirror elements as well
  var mir_interact = [0, 0, 0];
  var sub_ray = rays[r];
  var count_sub_ray = -1;

  // Is the Sub Ray going to Interract with the Canvas?
  var flag_canvas_edge = false;
  
  while(flag_canvas_edge == false) {
    if(count_sub_ray > 500) {
      break;
    }
    count_sub_ray += 1
    console.log("Sub Ray no: ", count_sub_ray, sub_ray);

    if(sub_ray[2]>=0 && sub_ray[2]<90) {
      sub_ray[3] = 1;
    }
    else if(sub_ray[2]>=90 && sub_ray[2]<180) {
      sub_ray[3] = 2;
    }
    else if(sub_ray[2]>=180 && sub_ray[2]<270) {
      sub_ray[3] = 3;
    }
    else {
      sub_ray[3] = 4;
    }
    sub_ray[2] = Math.PI * (sub_ray[2]/180.0);
    console.log("Sub Ray no: ", count_sub_ray, sub_ray);

    var flag_unchanged = true;
    var flag_vertical_sub_ray = false;
    var flag_horizontal_sub_ray = false;
    var ray_slope = 0;

    // Points where the ray will hit the canvas
    if(sub_ray[2] == (Math.PI * 0.5)) {
      mir_interact[0] = sub_ray[0];
      mir_interact[1] = 0;
      flag_vertical_sub_ray = true;
    }
    else if(sub_ray[2] == (Math.PI * 1.5)) {
      mir_interact[0] = sub_ray[0];
      mir_interact[1] = canvas.height;
      flag_vertical_sub_ray = true;
    }
    else if(sub_ray[2] == (0)) {
      mir_interact[0] = canvas.width;
      mir_interact[1] = sub_ray[1];
      flag_horizontal_sub_ray = true;
    }
    else if(sub_ray[2] == (Math.PI)) {
      mir_interact[0] = 0;
      mir_interact[1] = sub_ray[1];
      flag_horizontal_sub_ray = true;
    }
    else {
      ray_slope = Math.tan(sub_ray[2]);
      switch(sub_ray[3]) {
        case 1: {
          if((sub_ray[0] + (sub_ray[1] / ray_slope)) <= canvas.width) {
            mir_interact[0] = sub_ray[0] + (sub_ray[1] / ray_slope);
            mir_interact[1] = 0;
          }
          else {
            mir_interact[0] = canvas.width;
            mir_interact[1] = sub_ray[1] - ray_slope*(canvas.width - sub_ray[0])
          }
          break;
        }
        case 2: {
          if((sub_ray[0] + (sub_ray[1] / ray_slope)) >= 0) {
            mir_interact[0] = sub_ray[0] + (sub_ray[1] / ray_slope);
            mir_interact[1] = 0;
          }
          else {
            mir_interact[0] = 0;
            mir_interact[1] = sub_ray[1] + ray_slope*sub_ray[0];
          }
          break;
        }
        case 3: {
          if((sub_ray[1] + (ray_slope * sub_ray[0]))  <= canvas.height) {
            mir_interact[0] = 0;
            mir_interact[1] = sub_ray[1] + (ray_slope * sub_ray[0]);
          }
          else {
            mir_interact[0] = sub_ray[0] - (canvas.height - sub_ray[1]) / ray_slope;
            mir_interact[1] = canvas.height;
          }
          console.log("Canvas Boundary", mir_interact);
          break;
        }
        case 4: {
          if((sub_ray[0] + (canvas.height - sub_ray[1]) / ray_slope) <= canvas.width) {
            mir_interact[0] = sub_ray[0] + (sub_ray[1] - canvas.height) / ray_slope;
            mir_interact[1] = canvas.height;
          }
          else {
            mir_interact[0] = canvas.width;
            mir_interact[1] = sub_ray[1] - ray_slope*(canvas.width - sub_ray[0]);
          }
          break;
        }
      }
    }

    var closest_dist = 4000;
    console.log("Closest Dist Initial", closest_dist)
    
    // Iterating through each Mirror to find the mirror with which the Sub Ray will Interract
    for(var m = 0; m < mirrors.length; m++) {

      console.log("Mirror ", (m+1));
      var x = 0;
      var y = 0;
      var mir_slope = 0;
      var flag_vertical_mir = false;
      var flag_horizontal_mir = false;

      if (mirrors[m][0] == mirrors[m][2]) {
        flag_vertical_mir = true;

        if(flag_vertical_sub_ray) {
          continue;
        }
        else if(flag_horizontal_sub_ray) {
          // Finds the value of x and y for a horizontal ray and a vertical mirror
          x = mirrors[m][0];
          y = sub_ray[1];
          break;
        }
        // Finds the value of x and y for a ray which has slope neither 0 nor infinity and a vertical mirror
        x = mirrors[m][0];
        y = sub_ray[1] + ray_slope * (sub_ray[0] - mirrors[m][0]);
      }
      else if(mirrors[m][1] == mirrors[m][3]) {
        flag_horizontal_mir = true;

        if(flag_horizontal_sub_ray) {
          continue;
        }
        else if(flag_vertical_sub_ray) {
          // Finds the value of x and y for a vertical ray and a horizontal mirror
          x = sub_ray[0];
          y = mirrors[m][1];
          break;
        }
        // Finds the value of x and y for a ray which has slope neither 0 nor infinity and a horizontal mirror
        x = sub_ray[0] + (sub_ray[1] - mirrors[m][1])/ray_slope;
        y = mirrors[m][1];
      }
      else if(flag_vertical_sub_ray) {
        // Finds the value of x and y for a vertical ray and a mirror which has slope neither 0 nor infinity
        mir_slope = (mirrors[m][1] - mirrors[m][3])/(mirrors[m][2] - mirrors[m][0]);
        x = sub_ray[0];
        y = mirrors[m][1] + mir_slope*(mirrors[m][0] - sub_ray[0]);
      }
      else if(flag_horizontal_sub_ray) {
        // Finds the value of x and y for a horizontal ray and a mirror which has slope neither 0 nor infinity
        mir_slope = (mirrors[m][1] - mirrors[m][3])/(mirrors[m][2] - mirrors[m][0]);
        x = mirrors[m][0] + (mirrors[m][1] - sub_ray[1])/mir_slope;
        y = sub_ray[1];
      }
      else {
        mir_slope = (mirrors[m][1] - mirrors[m][3])/(mirrors[m][2] - mirrors[m][0]);
        // console.log(mir_slope, "Mirror Slope");

        if(ray_slope == mir_slope) {
          continue;
        }
        
      // Point of Intersection of mirror and Ray equations
      x = ((mirrors[m][1] - sub_ray[1]) + (mir_slope*mirrors[m][0] - ray_slope*sub_ray[0])) / (mir_slope - ray_slope);
      y = ((ray_slope*mir_slope*(sub_ray[0] - mirrors[m][0])) + (mir_slope*sub_ray[1] - ray_slope*mirrors[m][1])) / (mir_slope - ray_slope);
      }
      // console.log(x, y, "X and Y Coordinates");
      
      var flag_ray_dir = false;
      // checking if the mirror is in the direction that the ray is pointing at
      switch(sub_ray[3]) {
        case 1: {
          if(x>=sub_ray[0] && y<=sub_ray[1]) {
            flag_ray_dir = true;
          }
          break;
        }
        case 2: {
          if(x<=sub_ray[0] && y<=sub_ray[1]) {
            flag_ray_dir = true;
          }
          break;
        }
        case 3: {
          if(x<=sub_ray[0] && y>=sub_ray[1]) {
            flag_ray_dir = true;
          }
          break;
        }
        case 4: {
          if(x>=sub_ray[0] && y>=sub_ray[1]) {
            // console.log(x, y, sub_ray)
            flag_ray_dir = true;
          }
          break;
        }
      }
      if(flag_ray_dir == false) {
        continue;
      }
  
      var dist = Math.sqrt(Math.pow((x - sub_ray[0]), 2) + Math.pow((y - sub_ray[1]), 2))
      if(dist < 0.05 ) {
        continue;
      }
      console.log("Mirror ", (m+1), " Distance ", dist);

      if(dist < closest_dist) {
        console.log("Entered dist < closest dist loop");
        var flag_temp = false;
        if(flag_vertical_mir && y >= Math.min(mirrors[m][1], mirrors[m][3]) && y <= Math.max(mirrors[m][1], mirrors[m][3])) {
          console.log((m+1), "case1");
          mir_interact[2] = Math.PI * 0.5;
          flag_temp = true;
        }
        else if(flag_horizontal_mir && x >= Math.min(mirrors[m][0], mirrors[m][2]) && x <= Math.max(mirrors[m][0], mirrors[m][2])) {
          console.log((m+1), "case2", );
          mir_interact[2] = Math.PI;
          flag_temp = true;
        }
        else if(x >= Math.min(mirrors[m][0], mirrors[m][2]) && x <= Math.max(mirrors[m][0], mirrors[m][2]) && y >= Math.min(mirrors[m][1], mirrors[m][3]) && y <= Math.max(mirrors[m][1], mirrors[m][3])) {
          console.log((m+1), "case3");
          console.log(x, y, sub_ray, mirrors[m]);
          mir_interact[2] = Math.atan((mirrors[m][1] - mirrors[m][3])/(mirrors[m][2] - mirrors[m][0]));
          flag_temp = true;
        }
        // if((Math.round(x*10000)/10000) == (Math.round(sub_ray[0]*10000)/10000) && (Math.round(y*10000)/10000) == (Math.round(sub_ray[1]*10000)/10000)) {
        //   flag_temp = false;
        // }
        if(flag_temp) {
          flag_unchanged = false;
          mir_interact[0] = x;
          mir_interact[1] = y;
        }
      }
      console.log("Mirror Interract After each Mirror Iteration", mir_interact);
    }

    console.log("Mirror Interract on exiting While Loop", mir_interact);
    c.beginPath();
    c.lineWidth = 1;
    c.moveTo(sub_ray[0], sub_ray[1]);
    c.lineTo(mir_interact[0], mir_interact[1]);
    c.strokeStyle = rays[r][4];
    c.stroke();

    if(flag_unchanged){
      flag_canvas_edge = true;
    }
    else {
      sub_ray[0] = mir_interact[0];
      sub_ray[1] = mir_interact[1];

      console.log("Before", mir_interact[2], mir_interact[2]*(180/Math.PI));
      // find new_ray_angle
      if(mir_interact[2] < 0) {
        mir_interact[2] += Math.PI;
      }
      if(sub_ray[3] == 3 || sub_ray[3] == 4) {
        mir_interact[2] += Math.PI;
      }
      console.log("After", mir_interact[2], mir_interact[2]*(180/Math.PI));

      console.log("GGGGGGGG", sub_ray[2] * (180/Math.PI));
      sub_ray[2] = sub_ray[2] + 2*(mir_interact[2] - sub_ray[2]);
      sub_ray[2] %= (2 * Math.PI);
      sub_ray[2] = (sub_ray[2] * (180/Math.PI));
      console.log(sub_ray);
    }
  } //end Subrays while loop
} //end Rays for loop