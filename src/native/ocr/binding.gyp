{
  'targets': [
    {
      'target_name': 'ocr',
      'type': 'static_library',
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      'sources': [
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
              "-llib/tesseract",
              "-llib/leptonica",
              "-llib/libarchive"
            ]
          }
        ]
      ]
    }
  ]
}
