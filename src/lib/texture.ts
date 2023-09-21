export async function createTexture(src: string): Promise<WebGLTexture> {
    const texture = gl.createTexture()
    if (!texture) throw new Error("Failed to create texture")
    gl.bindTexture(gl.TEXTURE_2D, texture)

    // Fill the texture with a 1x1 blue pixel
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 255, 255]),
    )

    const image = new Image()
    image.src = "textures/" + src
    return new Promise(resolve => {
        image.addEventListener("load", function() {
            gl.bindTexture(gl.TEXTURE_2D, texture)
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                image,
            )
            gl.generateMipmap(gl.TEXTURE_2D)
            resolve(texture)
        })
    })
}
