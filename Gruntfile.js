'use strict';


module.exports = function(grunt) {

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
	  all: {
	      
	      options: {
		  namespace: function(filename) {
		      var root = filename.replace("static/scriptus/hb","");
		      var fname = root.replace(/(.*)\.handlebars/, '$1');		   var l_ns = fname.split('/');
		      l_ns.pop();
		      var p_name = "ScriptusTemplates"+l_ns.join('.');
		      return p_name;
		  },
		  processName: function(filepath) {
		      var last_part = filepath.split('/').pop();
		      var t_name = last_part.split('.')[0]
		      return t_name;
		  },
		  //amd: true
	      },
	      files: {
		  'src/es6/hb/sw_handlebars.js' : [ 'static/scriptus/hb/**/*.handlebars']
	      }
	  }
      },
      webpack: {
	  storyboard: {
	      entry: {
		  storyboard: './src/es6/sw_storyboard.js'
	      },
	      output: {
		  path: 'static/scriptus/js',
		  filename: '[name].bundle.js'
	      },
	      module: {
		  loaders: [
		      {
			  test: /\.js$/,
			  exclude: /node_modules/,
			  loader: 'babel-loader',
		      },
		      {
			  test: /\.handlebars$/,
			  loader: 'handlebars-loader?helperDirs[]=' + __dirname + 'src/es6/filters'
		      }
		  ]
	      },
	      //devtool: '#inline-source-map'
	      
	  }
	  /*	  options: {
	      transform: [
		  ['babelify', {
		      
		      sourceMap: true,
		      presets: ['babel-preset-es2015']
		  }]
	  ]},
	  dist: {
	      files: [{
		  
		  expand: true,
		  cwd: 'src/es6',
		  src: ['*.js'],
		  dest: 'static/scriptus/js'
	      }]
	  }*/
      },
      traceur: {
	  options: {
      // traceur options here
	      experimental: true,
	      
	      // module naming options,
	      moduleNaming: {
		  stripPrefix: 'static/scriptus/js',
		  addPrefix: 'scriptus'
	      },
	      copyRuntime: 'static/scriptus/js'
	  },
	  custom: {
	      files: [{
		  expand: true,
		  cwd: 'src/es6',
		  src: ['**/*.js'],
		  dest: 'static/scriptus/js'
	      }]
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
		  files: 'src/es6/**.js',
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
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
grunt.loadNpmTasks('grunt-traceur');
grunt.loadNpmTasks('grunt-webpack');
    // Default task.
  grunt.registerTask('default', ['jshint', 'qunit', 'clean', 'concat', 'uglify']);

};
