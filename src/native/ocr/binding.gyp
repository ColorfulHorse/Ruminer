{
  'targets': [
    {
      'target_name': 'ocr',
      "cflags!": [ "-fno-exceptions", "-fPIC" ],
      "cflags_cc!": [ "-fno-exceptions", "-fPIC" ],
      "ldflags": [
        "-Wl,-rpath,'$$ORIGIN'"
      ],
      "sources": [
          'src/lib.cpp',
          'src/index.cpp'
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
        "src/include",
        "src/include/leptonica",
        "src/include/tesseract"
      ],
      "dependencies":[
      	"<!(node -p \"require('node-addon-api').gyp\")"
      ],
      'defines': [
        'NAPI_DISABLE_CPP_EXCEPTIONS'
      ],
      "conditions": [
        ["OS=='win'",
          {
            'variables': {
               'root_dir': "<(module_root_dir)/../../../libs",
               'lib_dir': "D:/tools/vcpkg/installed/x64-windows/lib"
               },
            "libraries": [
              # "-l<(lib_dir)/tesseract41.lib",
              "-l<(module_root_dir)/libs/tesseract41.lib"
              # "-lKernel32"
              # "-l<(lib_dir)/leptonica-1.78.0.lib",
              # "-l<(lib_dir)/jpeg.lib",
              # "-l<(lib_dir)/gif.lib",
              # "-l<(lib_dir)/libpng16.lib",
              # "-l<(lib_dir)/tiff.lib",
              # "-l<(lib_dir)/lzma.lib",
              # "-l<(lib_dir)/zlib.lib",
              # "-l<(lib_dir)/webp.lib",
              # "-l<(lib_dir)/archive.lib",
              # "-l<(lib_dir)/turbojpeg.lib",
              # "-l<(lib_dir)/bz2.lib"
            ]
            # "libraries": [
            #   # "-l<(lib_dir)/tesseract41.lib",
            #   "-L<(module_root_dir)/libs",
            #   "-ltesseract41.lib"
            #   # "-lleptonica-1.78.0.lib",
            #   # "-ljpeg.lib",
            #   # "-lgif.lib",
            #   # "-llibpng16.lib",
            #   # "-ltiff.lib",
            #   # "-llzma.lib",
            #   # "-lzlib.lib",
            #   # "-lwebp.lib",
            #   # "-larchive.lib",
            #   # "-lturbojpeg.lib",
            #   # "-lbz2.lib"
            # ]
            # "libraries": [
            #   "-ljpeg62.dll",
            #   "-lleptonica-1.78.0.dll",
            #   "-llibpng16.dll",
            #   "-llzma.dll",
            #   "-ltiff.dll",
            #   "-lwebp.dll",
            #   "-lzlib1.dll"
            # ]
          }
        ]
      ]
    }
  ]
}
