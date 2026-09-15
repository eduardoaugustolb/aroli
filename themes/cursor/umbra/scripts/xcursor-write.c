#include <X11/Xcursor/Xcursor.h>
#include <errno.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

static int append_image(XcursorImages *images, const char *path, int size, int xhot, int yhot) {
  FILE *file = fopen(path, "rb");
  if (!file) { perror(path); return 0; }
  size_t length = (size_t)size * size * 4;
  unsigned char *rgba = malloc(length);
  if (!rgba || fread(rgba, 1, length, file) != length) {
    fprintf(stderr, "Could not read raw RGBA image: %s\n", path);
    free(rgba); fclose(file); return 0;
  }
  fclose(file);
  XcursorImage *image = XcursorImageCreate(size, size);
  if (!image) { free(rgba); return 0; }
  image->xhot = xhot;
  image->yhot = yhot;
  image->size = size;
  for (int i = 0; i < size * size; i++) {
    unsigned char *pixel = rgba + i * 4;
    /* Xcursor stores premultiplied ARGB, whereas the input is straight RGBA. */
    uint32_t alpha = pixel[3];
    uint32_t red = (pixel[0] * alpha + 127) / 255;
    uint32_t green = (pixel[1] * alpha + 127) / 255;
    uint32_t blue = (pixel[2] * alpha + 127) / 255;
    image->pixels[i] = (alpha << 24) | (red << 16) | (green << 8) | blue;
  }
  free(rgba);
  images->images[images->nimage++] = image;
  return 1;
}

int main(int argc, char **argv) {
  if (argc < 6 || (argc - 4) % 2) {
    fprintf(stderr, "Usage: %s OUTPUT XHOT YHOT SIZE RAW [SIZE RAW ...]\n", argv[0]);
    return 2;
  }
  int count = (argc - 4) / 2;
  XcursorImages *images = XcursorImagesCreate(count);
  if (!images) return 1;
  for (int i = 4; i < argc; i += 2) {
    int size = atoi(argv[i]);
    int xhot = (int)((long)atoi(argv[2]) * size / 48);
    int yhot = (int)((long)atoi(argv[3]) * size / 48);
    if (!size || !append_image(images, argv[i + 1], size, xhot, yhot)) {
      XcursorImagesDestroy(images); return 1;
    }
  }
  int ok = XcursorFilenameSaveImages(argv[1], images);
  XcursorImagesDestroy(images);
  return ok ? 0 : 1;
}
