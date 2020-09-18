{
  'targets': [
    {
      'target_name': 'ocr',
      "cflags!": [ "-fno-exceptions", "-fPIC" ],
      "cflags_cc!": [ "-fno-exceptions", "-fPIC" ],
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
            'variables': {
               'root_dir': "<(module_root_dir)/../../../libs",
               },
            "copies": [{
              'destination': '<(root_dir)',
              'files': [
                "<(module_root_dir)/lib/libtesseract.dll",
                "<(module_root_dir)/lib/leptonica.dll",
                "<(module_root_dir)/lib/libarchive.dll",
                "<(module_root_dir)/lib/libtesseract.lib",
                "<(module_root_dir)/lib/leptonica.lib",
                "<(module_root_dir)/lib/libarchive.lib"
                ]
            }],
            "libraries": [
              "-l<(module_root_dir)/lib/libtesseract",
              "-l<(module_root_dir)/lib/leptonica",
              "-l<(module_root_dir)/lib/libarchive"
            ]
        #     '-L<(module_root_dir)/dir-for-glfw3dll/',
        # '-Wl,-rpath-link,<(module_root_dir)/dir-for-glfw3dll/',
        # '-Wl,-rpath,\$$ORIGIN/../../dir-for-glfw3dll/'
          }
        ]
      ]
    }
  ]
}
