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
               },
            # "copies": [{
            #   'destination': '<(root_dir)',
            #   'files': [
            #     "<(module_root_dir)/lib/org.sw.demo.google.tesseract.libtesseract-master.dll",
            #     "<(module_root_dir)/lib/org.sw.demo.danbloomberg.leptonica-1.80.0.dll",
            #     "<(module_root_dir)/lib/org.sw.demo.libarchive.libarchive-3.4.3.dll",
            #     "<(module_root_dir)/lib/org.sw.demo.google.tesseract.libtesseract-master.lib",
            #     "<(module_root_dir)/lib/org.sw.demo.danbloomberg.leptonica-1.80.0.lib",
            #     "<(module_root_dir)/lib/org.sw.demo.libarchive.libarchive-3.4.3.lib",
            #     "<(module_root_dir)/lib/org.sw.demo.google.tesseract.libtesseract-master.exp",
            #     "<(module_root_dir)/lib/org.sw.demo.danbloomberg.leptonica-1.80.0.exp",
            #     "<(module_root_dir)/lib/org.sw.demo.libarchive.libarchive-3.4.3.exp"
            #     ]
            # }],
            # "libraries": [
            #   "-l<(module_root_dir)/lib/org.sw.demo.google.tesseract.libtesseract-master.lib",
            #   "-l<(module_root_dir)/lib/org.sw.demo.danbloomberg.leptonica-1.80.0.lib",

            #   "-l<(module_root_dir)/lib/org.sw.demo.libarchive.libarchive-3.4.3.lib"
            # ]
            "libraries": [
              "-l<(module_root_dir)/libs/tesseract41.lib"
              # "-ljpeg62",
              # "-lleptonica-1.78.0",
              # "-llibpng16",
              # "-llzma",
              # "-ltiff",
              # "-lwebp",
              # "-lzlib1"
            ]
            # "libraries": [
            #   "../lib/libtesseract.lib",
            #   "../lib/leptonica.lib",
            #   "../lib/libarchive.lib"
            # ]
            # 'link_settings': {
            #   'libraries': [
            #     '-Wl,-rpath,<!@(qmake -query "QT_INSTALL_PREFIX")/lib',
            #     '-l<(module_root_dir)/lib/libtesseract',
            #     '-l<(module_root_dir)/lib/libtesseract',
            #     '-l<(module_root_dir)/lib/libtesseract'
            #   ]
            # }
          }
        ]
      ]
    }
  ]
}
