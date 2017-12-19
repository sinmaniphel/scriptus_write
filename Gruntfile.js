'use strict'

module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('scriptus_write.jquery.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    handlebars: {

    },
    webpack: {
      storyboard: {
        entry: ['./src/ts/sw_storyboard.ts'],
        output: {
          path: 'static/scriptus/js',
          // path: 'dist',
          filename: 'storyboard.bundle.js'
        },
        node: {
          fs: 'empty',
          net: 'empty',
          tls: 'empty'
        },
        resolve: {
       // Add '.ts' and '.tsx' as resolvable extensions.
          extensions: ['', '.ts', '.tsx', '.js', '.json', '.handlebars'],
          modulesDirectories: ['node_modules', './src']
        },
        externals: {
          jquery: 'jQuery'
        },
        stats: {
          colors: true,
          modules: true,
          reasons: true,
          errorDetails: true
        },
        module: {
          rules: [

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
          ],
          loaders: [
//   {
// test: /\.js$/,
// exclude: /node_modules/,
// loader: 'babel-loader',
//   },
        // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            {
              test: /\.handlebars$/,
              loader: 'handlebars-loader',
              query: {
                precompileOptions: {
                  knownHelpersOnly: false
                }
              }
            },

          { test: /\.ts?$/, loader: 'awesome-typescript-loader' }
          ]
        },
        devtool: 'source-map'
      }
    },
    clean: {
      files: ['dist']
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['src/jquery.<%= pkg.name %>.js'],
        dest: 'dist/jquery.<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/jquery.<%= pkg.name %>.min.js'
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      options: {
        jshintrc: true
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['src/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      }
    },
	  watch: {
	      scripts: {
		  files: 'src/es6/**/*.js',
		  tasks: ['browserify']
	      },
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'qunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      },
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-qunit')
  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-handlebars')
  grunt.loadNpmTasks('grunt-traceur')
  grunt.loadNpmTasks('grunt-webpack')
    // Default task.
    grunt.registerTask('default', ['jshint', 'qunit', 'clean', 'concat', 'uglify'])
}
