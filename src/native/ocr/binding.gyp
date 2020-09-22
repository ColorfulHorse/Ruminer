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
            "copies": [{
              'destination': '<(root_dir)',
              'files': [
                "<(module_root_dir)/lib/org.sw.demo.google.tesseract.libtesseract-master.dll",
                "<(module_root_dir)/lib/org.sw.demo.danbloomberg.leptonica-1.80.0.dll",
                "<(module_root_dir)/lib/org.sw.demo.libarchive.libarchive-3.4.3.dll",
                "<(module_root_dir)/lib/org.sw.demo.google.tesseract.libtesseract-master.lib",
                "<(module_root_dir)/lib/org.sw.demo.danbloomberg.leptonica-1.80.0.lib",
                "<(module_root_dir)/lib/org.sw.demo.libarchive.libarchive-3.4.3.lib",
                "<(module_root_dir)/lib/org.sw.demo.google.tesseract.libtesseract-master.exp",
                "<(module_root_dir)/lib/org.sw.demo.danbloomberg.leptonica-1.80.0.exp",
                "<(module_root_dir)/lib/org.sw.demo.libarchive.libarchive-3.4.3.exp"
                ]
            }],
            # "libraries": [
            #   "-l<(module_root_dir)/lib/org.sw.demo.google.tesseract.libtesseract-master.lib",
            #   "-l<(module_root_dir)/lib/org.sw.demo.danbloomberg.leptonica-1.80.0.lib",

            #   "-l<(module_root_dir)/lib/org.sw.demo.libarchive.libarchive-3.4.3.lib"
            # ]
            "libraries": [
              "-l<(module_root_dir)/lib/org.sw.demo.google.tesseract.libtesseract-master.dll",
              "-l<(module_root_dir)/lib/org.sw.demo.danbloomberg.leptonica-1.80.0.dll",
              "-l<(module_root_dir)/lib/org.sw.demo.libarchive.libarchive-3.4.3.dll",
              "-l<(module_root_dir)/lib/org.sw.demo.gif-5.2.1.dll",
              "-l<(module_root_dir)/lib/org.sw.demo.jpeg-9.4.0.dll",
              "-l<(module_root_dir)/lib/org.sw.demo.uclouvain.openjpeg.openjp2-2.3.1.dll",
              "-l<(module_root_dir)/lib/org.sw.demo.glennrp.png-1.6.37.dll",
              "-l<(module_root_dir)/lib/org.sw.demo.tiff-4.1.0.dll",
              "-l<(module_root_dir)/lib/org.sw.demo.webmproject.webp-1.0.3.dll",
              "-l<(module_root_dir)/lib/org.sw.demo.madler.zlib-1.2.11.dll",
              "-l<(module_root_dir)/lib/org.sw.demo.bzip2-1.0.8.dll",
              "-l<(module_root_dir)/lib/org.sw.demo.lz4-1.9.2.dll",
              "-l<(module_root_dir)/lib/org.sw.demo.xmlsoft.libxml2-2.9.10.dll",
              "-l<(module_root_dir)/lib/org.sw.demo.oberhumer.lzo.lzo-2.10.0.dll",
              "-l<(module_root_dir)/lib/org.sw.demo.xz_utils.lzma-5.2.4.dll",
              "-l<(module_root_dir)/lib/org.sw.demo.gnu.iconv.libiconv-1.16.0.dll",
              "-l<(module_root_dir)/lib/org.sw.demo.gnu.iconv.libcharset-1.16.0.dll"
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
