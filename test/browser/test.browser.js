var Twig = Twig || require("../twig"),
    twig = twig || Twig.twig;

describe("Twig.js Browser Loading ->", function() {
    it("Should load a template synchronously", function() {

        twig({
            id:   'remote-browser',
            href: 'templates/test.twig',
            async: false
        });

        // Verify the template was loaded
        twig({ref: 'remote-browser'}).render({
            test: "reload",
            flag: false
        }).should.equal("Test template = reload\n\n");
    });
    
    it("Should trigger the error callback for a missing template", function(done) {

        twig({
            href: 'templates/notthere.twig',
            load: function(template) {
                // failure
                throw "Template didn't trigger error callback";
            },
            error: function(err) {
                console.log(err);
                done();
            }
        });
    });

    it("Should load a template asynchronously", function(done) {

        // Test loading a template from a remote endpoint asynchronously
        twig({
            id:   'remote-browser-async',
            href: 'templates/test.twig',

            // Callback after template loads
            load: function(template) {
                template.render({
                    test: "yes",
                    flag: true
                }).should.equal("Test template = yes\n\nFlag set!");

                // Verify the template was saved
                twig({ref: 'remote-browser-async'}).render({
                    test: "reload",
                    flag: false
                }).should.equal("Test template = reload\n\n");

                done();
            }
        });
    });

    it("should be able to extend to a relative template path", function(done) {
        // Test loading a template from a remote endpoint
        twig({
            href: 'templates/child.twig',

            load: function(template) {
                template.render({ base: "template.twig" }).should.equal( "Other Title - child" );
                done();
            }
        });
    });

    it("should be able to extend to a absolute template path", function(done) {
        // Test loading a template from a remote endpoint
        twig({
            base: 'templates',
            href: 'templates/a/child.twig',

            load: function(template) {
                template.render({ base: "b/template.twig" }).should.equal( "Other Title - child" );
                done();
            }
        });
    });

    it("should load an included template with no context (async)", function() {
        twig({
            id:   'include-async',
            href: 'templates/include.twig',
            async: true
        });

        // Load the template
        twig({ref: 'include'}).render({test: 'tst'}).should.equal( "BeforeTest template = tst\n\nAfter" );
    });

    it("should load an included template with additional context (async)", function() {
        twig({
            id:   'include-with-async',
            href: 'templates/include-with.twig',
            async: true
        });

        // Load the template
        twig({ref: 'include-with'}).render({test: 'tst'}).should.equal( "template: before,tst-mid-template: after,tst" );
    });

    it("should load an included template with only additional context (async)", function() {
        twig({
            id:   'include-only-async',
            href: 'templates/include-only.twig',
            async: true
        });

        // Load the template
        twig({ref: 'include-only'}).render({test: 'tst'}).should.equal( "template: before,-mid-template: after," );
    });

    it("should load an included template with no context (sync)", function() {
        twig({
            id:   'include',
            href: 'templates/include.twig',
            async: false
        });

        // Load the template
        twig({ref: 'include'}).render({test: 'tst'}).should.equal( "BeforeTest template = tst\n\nAfter" );
    });

    it("should load an included template with additional context (sync)", function() {
        twig({
            id:   'include-with',
            href: 'templates/include-with.twig',
            async: false
        });

        // Load the template
        twig({ref: 'include-with'}).render({test: 'tst'}).should.equal( "template: before,tst-mid-template: after,tst" );
    });

    it("should load an included template with only additional context (sync)", function() {
        twig({
            id:   'include-only',
            href: 'templates/include-only.twig',
            async: false
        });

        // Load the template
        twig({ref: 'include-only'}).render({test: 'tst'}).should.equal( "template: before,-mid-template: after," );
    });
});
