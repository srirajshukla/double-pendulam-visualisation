# Double Pendulam Visualization

## Visualizing double pendulam motion using wasm and rust.

# Dependencies

- [Double Pendulam](https://github.com/srirajshukla/double-pendulam-calc-rust)
- [wasm-pack](https://github.com/rustwasm/wasm-pack)
- [node.js](https://nodejs.org/en/)

# Building
1. Download  the [Double Pendulam](https://github.com/srirajshukla/double-pendulam-calc-rust) library. 
2. In `Cargo.toml` file, in dependencies section, edit the path of `double-pendulum` to the downloaded relative location of the library. 

3. Next, make sure that you have installed `wasm-pack`, if not, you can install it using 
`cargo install wasm-pack`.

4. Next, build the `dp-vis` library using 
`wasm-pack build`.

5. Make sure that you've [Node.js](https://nodejs.org/en/) installed, if not install it. 

6. Now, cd into `/www/` directory and run
`npm run start` command, and voila! You're done!

# Examples
![3 Double Pendulums in their motion, followed by adding another pendulum.](./examples/pendulum_ssGif.gif)