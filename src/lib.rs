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
}

#[wasm_bindgen]
impl Pendulam {
    pub fn new(m1: f64, m2:f64, a1: f64, a2: f64, l1:f64, l2:f64, damp_factor:f64) -> Pendulam {
        // todo: expose angle a1 and a2 to public api
        let pendulam = DoublePendulam::new(m1, m2, a1, a2, l1, l2, damp_factor);

        Pendulam { p: pendulam }
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