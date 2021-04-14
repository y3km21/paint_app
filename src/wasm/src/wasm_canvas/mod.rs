mod pixel;
use wasm_bindgen::prelude::*;
//use js_sys::Math;




#[wasm_bindgen]
pub struct WasmCanvas{
    width : usize,
    height : usize,
    pixels: Vec<pixel::Pixel>,
    draw_color: pixel::Pixel
}

#[wasm_bindgen]
impl WasmCanvas {
    pub fn new(width :usize, height: usize) -> WasmCanvas{
        WasmCanvas{ pixels : vec![pixel::Pixel::new(); width * height], width : width, height : height, draw_color: pixel::Pixel::new_opt(0,0,0)}
    }

    pub fn width(&self) -> usize {
        self.width
    }
    
    pub fn height(&self) -> usize {
        self.height
    }

    pub fn pixels(&self) -> *const pixel::Pixel {
        self.pixels.as_ptr()
    }

    pub fn draw_color_set(&self, red: u8, green:u8, blue: u8) {
        self.draw_color.set(red,green,blue);
    }

    //pub fn draw_color_get(&self)-> RGBAColor{
    //    self.draw_color.get()
    //}

    pub fn pipette(&mut self, x: usize, y:usize) -> JsValue{
        if let Some(elem) = self.pixels.get(y * self.width + x){
            JsValue::from_serde(&elem).unwrap()
        }else{
            JsValue::UNDEFINED
        }
        
    }

    pub fn draw(&mut self, x: usize, y: usize){
        if let Some(elem) = self.pixels.get_mut(y * self.width + x){
            *elem = self.draw_color.clone();
            
        }
    } 

    pub fn draw_line(&mut self, x0: usize, y0: usize, x1: usize, y1: usize){
        let mut x = x0 as i32;
        let mut y = y0 as i32;

        let dx = (x1 as i32 - x0 as i32).abs();
        let dy = (y1 as i32 - y0 as i32).abs();

        let mut sx = 1 as i32;
        let mut sy = 1 as i32;
        if x0 > x1{sx = -1;}
        if y0 > y1{sy = -1;}
        let mut err = dx - dy;

        loop {
            if let Some(elem) = self.pixels.get_mut(y as usize * self.width + x as usize){
                *elem = self.draw_color.clone();
            }
            if x == x1 as i32 && y == y1 as i32 { return;}
            
            let e2 = 2 * err;
            if e2 > -dy {
                err -= dy;
                x += sx;
            }
            if e2 < dx {
                err += dx;
                y += sy;
            }
        } 
        
    }
}