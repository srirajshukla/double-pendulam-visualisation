mod utils;
use double_pendulam::DoublePendulam;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
#[derive(Clone, Copy, Debug)]
pub struct Pendulam {
    p: DoublePendulam,
    line_color: Colors,
    bob_color: Colors
}

#[wasm_bindgen]
#[derive(Clone, Debug)]
pub struct PendulamVector{
    pv: Vec<Pendulam>,
    size: usize,
}

/// Colors: Models the rgba color type
/// red: u8
/// green: u8
/// blue: u8
/// alpha: f64
#[wasm_bindgen]
#[derive(Clone, Copy, Debug)]
pub struct Colors{
    red: u8,
    green: u8,
    blue: u8,
    alpha: f64,
}

#[wasm_bindgen]
impl Colors{
    pub fn new(red: u8, green: u8, blue: u8, alpha: f64) -> Self{
        Colors{
            red: red.rem_euclid(255),
            green: green.rem_euclid(255),
            blue: blue.rem_euclid(255),
            alpha : if alpha>1.0{
                1.0
            } else if alpha <0.0{
                0.0
            } else{
                alpha
            }
        }
    }

    pub fn rgba(&self) -> String{
        format!("rgba({}, {}, {}, {})", self.red, self.green, self.blue, self.alpha)
    }
}

#[wasm_bindgen]
impl PendulamVector {
    pub fn new() -> Self{
        PendulamVector {pv:vec![], size:0}
    }

    pub fn size(&self) -> usize{
        self.pv.len()
    }

    pub fn add(&mut self, pendulam: Pendulam){
        self.pv.push(pendulam);
    }

    pub fn remove(&mut self, index: usize){
        self.pv.remove(index);
    }

    pub fn item_x1(&self, index:usize) -> f64{
        return self.pv[index].x1()
    }
    pub fn item_x2(&self, index:usize) -> f64{
        return self.pv[index].x2()
    }
    pub fn item_y1(&self, index:usize) -> f64{
        return self.pv[index].y1()
    }
    pub fn item_y2(&self, index:usize) -> f64{
        return self.pv[index].y2()
    }

    pub fn item_motion(&mut self, index:usize) {
        self.pv[index].motion()
    }

    pub fn item_line_color(&self, index:usize) -> String{
        self.pv[index].line_color.rgba()
    }
    pub fn item_bob_color(&self, index:usize) -> String{
        self.pv[index].bob_color.rgba()
    }
}

#[wasm_bindgen]
impl Pendulam {
    pub fn new(m1: f64, m2:f64, a1: f64, a2: f64, l1:f64, l2:f64, damp_factor:f64) -> Pendulam {
        // todo: expose angle a1 and a2 to public api
        let pendulam = DoublePendulam::new(m1, m2, a1, a2, l1, l2, damp_factor);
        let line_color = Colors::new(0, 0, 0, 1f64);        // black
        let bob_color = Colors::new(255, 0, 0, 1f64);       // red
        Pendulam { p: pendulam, line_color, bob_color}
    }
    pub fn new_with_color(m1: f64, m2:f64, a1: f64, a2: f64, l1:f64, l2:f64, damp_factor:f64, line_color: Colors, bob_color: Colors) -> Pendulam {
        // todo: expose angle a1 and a2 to public api
        let pendulam = DoublePendulam::new(m1, m2, a1, a2, l1, l2, damp_factor);
        Pendulam { p: pendulam, line_color, bob_color}
    }
    
    pub fn x1(&self) -> f64{
        self.p.get_joint().x()
    }
    pub fn x2(&self) -> f64{
        self.p.get_end().x()
    }
    pub fn y1(&self) -> f64{
        self.p.get_joint().y()
    }
    pub fn y2(&self) -> f64{
        self.p.get_end().y()
    }

    pub fn motion(&mut self){
        self.p.new_pos();
    }
}
