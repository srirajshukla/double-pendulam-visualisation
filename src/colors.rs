use wasm_bindgen::prelude::*;
/// Colors: Models the rgba color type
/// red: u8
/// green: u8
/// blue: u8
/// alpha: f64
#[wasm_bindgen]
#[derive(Clone, Copy, Debug)]
pub struct Colors{
    red: i16,
    green: i16,
    blue: i16,
    alpha: f64,
}

#[wasm_bindgen]
impl Colors{
    pub fn new(red: i16, green: i16, blue: i16, alpha: f64) -> Self{
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


    ///Creates a color object from hsl values
    ///adapted from http://en.wikipedia.org/wiki/HSL_color_space.
    ///Assumes h, s, and l are contained in the set [0, 1] and
    ///returns a Color object.
    ///
    ///@param   {f64}  hue                The hue
    ///@param   {f64}  saturation         The saturation
    ///@param   {f64}  lightness          The lightness
    ///@return  {f64}  Color              The Color object
    pub fn new_hsla(hue: f64, saturation: f64, lightness: f64, alpha: f64) -> Self{
        eprintln!("{}, {}, {}", &hue, &saturation, &lightness);
        // let mut r, g, b : f64;
        if saturation == 0f64{
            let c = (lightness*255.0).round() as i16;
            Colors{
                red: c,
                blue: c,
                green: c,
                alpha
            }
        } else{
            fn hue2rgb(p: f64, q:f64, mut t:f64) -> f64 {
                if t < 0.0{
                    t += 1.0;
                }
                if t > 1.0{
                    t -= 1.0;
                }
                if t < 1.0/6.0 {return p + (q - p) * 6.0 * t;}
                if t < 1.0/2.0 {return q;}
                if t < 2.0/3.0 {return p + (q - p) * (2.0/3.0 - t) * 6.0;}

                return p;
            }

            let q = if lightness < 0.5  {lightness * (1f64 + saturation)} else {lightness + saturation - lightness * saturation};
            let p = 2f64 * lightness - q;
            let r = hue2rgb(p, q, hue + 1f64/3f64);
            let g = hue2rgb(p, q, hue);
            let b = hue2rgb(p, q, hue - 1f64/3f64);

            Colors{
                red: (r*255.0).round() as i16, 
                green: (g*255.0).round() as i16,
                blue: (b*255.0).round() as i16,
                alpha
            }
        }
    }

    pub fn rgba(&self) -> String{
        format!("rgba({}, {}, {}, {})", self.red, self.green, self.blue, self.alpha)
    }
}

#[cfg(test)]
mod tests{
    use super::*;

    #[test]
    fn testcolor(){
        let red = Colors::new(248, 0, 0, 0.8);
        assert_eq!(red.rgba(), String::from("rgba(248, 0, 0, 0.8)"));
    }
    
    #[test]
    fn test_new_hsla(){
        let a = Colors::new_hsla(0.100, 0.0, 0.50, 1.0);
        assert_eq!(a.rgba(), String::from("rgba(128, 128, 128, 1)"));
        let b = Colors::new_hsla(200.0/360.0, 0.5, 0.5, 1.0);
        assert_eq!(b.rgba(), String::from("rgba(64, 149, 191, 1)"));
    }

    #[test]
    fn test_in_range_hsla(){
        let hue_0 = Colors::new_hsla(0.0/100.0, 0.8, 0.5,1.0);
        assert_eq!(hue_0.rgba(), String::from("rgba(230, 25, 25, 1)"));
        let hue_50 = Colors::new_hsla(50.0/100.0, 0.8, 0.5,1.0);
        assert_eq!(hue_50.rgba(), String::from("rgba(25, 229, 230, 1)"));
        let hue_100 = Colors::new_hsla(1.0, 0.8, 0.5,1.0);
        assert_eq!(hue_100.rgba(), String::from("rgba(230, 25, 25, 1)"));
    }
}
