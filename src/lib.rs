mod utils;
mod colors;
use colors::Colors;
use double_pendulum::DoublePendulum;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

/// Pendulum Struct
/// Members: p - Pendulum Structure
///          line_color: Color of Rod
///          bob_color:  Color of Bob
#[wasm_bindgen]
#[derive(Clone, Copy, Debug)]
pub struct Pendulum {
    p: DoublePendulum,
    line_color: Colors,
    bob_color: Colors
}


#[wasm_bindgen]
impl Pendulum {
    pub fn new(m1: f64, m2:f64, a1: f64, a2: f64, l1:f64, l2:f64, damp_factor:f64) -> Self {
        // todo: expose angle a1 and a2 to public api
        let pendulum = DoublePendulum::new(m1, m2, a1, a2, l1, l2, damp_factor);
        let line_color = Colors::new(0, 254, 254, 1f64);        // black
        let bob_color = Colors::new(254, 0, 0, 1f64);       // red
        Pendulum { p: pendulum, line_color, bob_color}
    }
    pub fn new_with_color(m1: f64, m2:f64, a1: f64, a2: f64, l1:f64, l2:f64, damp_factor:f64, line_color: Colors, bob_color: Colors) -> Self {
        // todo: expose angle a1 and a2 to public api
        let pendulum = DoublePendulum::new(m1, m2, a1, a2, l1, l2, damp_factor);
        Pendulum { p: pendulum, line_color, bob_color}
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

    pub fn m1(&self) -> f64{
        self.p.m1()
    }
    pub fn m2(&self) -> f64{
        self.p.m2()
    }
    pub fn l1(&self) -> f64{
        self.p.l1()
    }
    pub fn l2(&self) -> f64{
        self.p.l2()
    }

    pub fn motion(&mut self){
        self.p.new_pos();
    }
}


#[wasm_bindgen]
#[derive(Clone, Debug)]
pub struct PendulumVector{
    pv: Vec<Pendulum>,
    size: usize,
}



#[wasm_bindgen]
impl PendulumVector {
    pub fn new() -> Self{
        PendulumVector {pv:vec![], size:0}
    }

    pub fn size(&self) -> usize{
        self.pv.len()
    }

    pub fn add(&mut self, pendulum: Pendulum){
        self.pv.push(pendulum);
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

    pub fn item_m1(&self, index: usize) -> f64{
        self.pv[index].m1()
    }
    pub fn item_m2(&self, index: usize) -> f64{
        self.pv[index].m2()
    }
    pub fn item_l1(&self, index: usize) -> f64{
        self.pv[index].l1()
    }
    pub fn item_l2(&self, index: usize) -> f64{
        self.pv[index].l2()
    }
}

#[cfg(test)]
mod tests{
    use super::*;
    
    #[test]
    fn test_single_color_passing(){
        let c = Colors::new(20, 30, 40, 1.0);
        let p = Pendulum::new_with_color(1.0, 1.0, 0.0, 0.0, 10.0, 10.0, 0.0, c, c);

        println!("{:?}", &p);
        assert_eq!(p.m1(), 1.0);
    }
}