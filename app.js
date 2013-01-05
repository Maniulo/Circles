LibCanvas.extract();

atom.dom(function() {
   var canvas  = atom.dom('canvas').first;
   var context = canvas.getContext('2d-libcanvas');

   context
      .fillAll( '#efebe7' )
      .fill( new Rectangle( 75, 75, 30, 30 ), 'green' )
      .fill( new Circle   ( 50, 50, 20 )    , '#c00'  );
});