#version 300 es

// intrinsically defined variables in fragment shaders
// in bool gl_FrontFacing;
// in highp vec4 gl_FragCoord;
// in mediump vec2 gl_PointCoord;
// out highp float gl_FragDepth;

// built in constants for all shaders
// const mediump int  gl_MaxVertexAttribs = 16;
// const mediump int  gl_MaxVertexUniformVectors = 256;
// const mediump int  gl_MaxVertexOutputVectors = 16;
// const mediump int  gl_MaxFragmentInputVectors = 15;
// const mediump int  gl_MaxVertexTextureImageUnits = 16;
// const mediump int  gl_MaxCombinedTextureImageUnits = 32;
// const mediump int  gl_MaxTextureImageUnits = 16;
// const mediump int  gl_MaxFragmentUniformVectors = 224;
// const mediump int  gl_MaxDrawBuffers = 4;
// const mediump int  gl_MinProgramTexelOffset = -8;
// const mediump int  gl_MaxProgramTexelOffset = 7;

precision highp float;

in vec2 v_texcoord;

uniform sampler2D u_texture;

out vec4 out_color;

void main() {
    out_color = texture(u_texture, v_texcoord);
}