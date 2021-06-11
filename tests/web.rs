//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]

extern crate wasm_bindgen_test;
use wasm_bindgen_test::*;

extern crate dp_vis;
use dp_vis::*;
use dp_vis::Pendulum;
// wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
// #[cfg(test)]
fn dp (){
    let pi = std::f64::consts::PI;
    let p = Pendulum::new(10.0, 10.0, 0.0, pi/2.0, 50.0, 50.0, 0.01);
    assert_eq!(p.x1(), 0.0);
}

#[wasm_bindgen_test]
fn dnpvec(){
    let pi = std::f64::consts::PI;
    let p = Pendulum::new(10.0, 10.0, 0.0, pi/2.0, 50.0, 50.0, 0.01);
    let mut pv = PendulumVector::new();

    pv.add(p);

    assert_eq!(pv.item_x1(0), 0.0);
}

