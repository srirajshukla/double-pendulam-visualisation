use wasm_bindgen::prelude::*;
/// Colors: Models the rgba color type
/// red: u8
/// green: u8
/// blue: u8
/// alpha: f64
#[wasm_bindgen]
#[derive(Clone, Copy, Debug)]
pub struct Colors{
    red: u16,
    green: u16,
    blue: u16,
    alpha: f64,
}

#[wasm_bindgen]
impl Colors{
    pub fn new(red: u16, green: u16, blue: u16, alpha: f64) -> Self{
        Colors{
            red: red.rem_euclid(256),
            green: green.rem_euclid(256),
            blue: blue.rem_euclid(256),
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