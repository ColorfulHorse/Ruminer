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
        "src/include"
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
            "libraries": [
              "-l<(module_root_dir)/libs/tesseract41.lib",
              "-l<(module_root_dir)/libs/opencv_imgproc.lib",
              "-l<(module_root_dir)/libs/opencv_features2d.lib"
            ]
          }
        ]
      ]
    }
  ]
}
