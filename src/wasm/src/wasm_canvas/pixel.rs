//use js_sys::Math;
use std::cell::*;
//use wasm_bindgen::prelude::*;
use serde::{Serialize,Deserialize};

//#[wasm_bindgen]
#[derive(Clone,Debug, PartialEq, Eq,Serialize,Deserialize)]
pub struct Pixel{
    red: Cell<u8>,
    green: Cell<u8>,
    blue: Cell<u8>,
    alpha: Cell<u8>
}

impl Pixel{
    pub const fn new() -> Pixel{
        Pixel{ red: Cell::new(255), green: Cell::new(255), blue: Cell::new(255), alpha: Cell::new(255)}
    } 

    pub const fn new_opt(red: u8, green: u8, blue: u8) -> Pixel{
        Pixel{ red: Cell::new(red), green: Cell::new(green), blue: Cell::new(blue), alpha: Cell::new(255)}

    }

    pub fn set(&self, red: u8, green: u8, blue: u8){
        self.red.set(red);
        self.green.set(green);
        self.blue.set(blue);
    }

    pub fn overwrite(&self,  rhs: &Pixel){
        self.red.set(rhs.red.get());
        self.green.set(rhs.green.get());
        self.blue.set(rhs.blue.get());
    }

    /*
    fn colorwrite(&mut self, rhs: &mut Pixel){
        self.close_to_rhs(&self.red, &rhs.red);
    }

    fn close_to_rhs(&self, lhs:&Cell<u8> ,rhs:&Cell<u8> ){
        if lhs < rhs {
            match rhs.get() - lhs.get(){
                0..=25 => lhs.swap(rhs),
                _=> lhs.set(lhs.get() + 25),
            }
        }else if lhs > rhs {
            match lhs.get() - rhs.get(){
                0..=25 => lhs.swap(rhs),
                _ => lhs.set(lhs.get() - 25),
            }
        }else {}
    }
    */

        
}


