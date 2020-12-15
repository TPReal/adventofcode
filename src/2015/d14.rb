#!/usr/bin/env ruby

require_relative '../input'

input=Input[DATA].r
t=2503
rds={}
input.lines.each{ |l|
  mat=l.match(/^(\w+) can fly (\d+) km\/s for (\d+) seconds?, but then must rest for (\d+) seconds?\.$/)
  rds[mat[1]]={
    speed:mat[2].to_i,
    time:mat[3].to_i,
    rest:mat[4].to_i,
  }
}
p rds.map{ |n,params|
  d,m=t.divmod(params[:time]+params[:rest])
  (d*params[:time]+[m,params[:time]].min)*params[:speed]
}.max
poss=Hash::new{0}
pts=Hash::new{0}
t.times{ |tt|
  rds.each_pair{ |r,params|
    poss[r]+=params[:speed] if tt%(params[:time]+params[:rest])<params[:time]
  }
  max_pos=poss.values.max
  rds.keys.each{ |r|
    pts[r]+=1 if poss[r]==max_pos
  }
}
p pts.values.max

__END__
Dancer can fly 27 km/s for 5 seconds, but then must rest for 132 seconds.
Cupid can fly 22 km/s for 2 seconds, but then must rest for 41 seconds.
Rudolph can fly 11 km/s for 5 seconds, but then must rest for 48 seconds.
Donner can fly 28 km/s for 5 seconds, but then must rest for 134 seconds.
Dasher can fly 4 km/s for 16 seconds, but then must rest for 55 seconds.
Blitzen can fly 14 km/s for 3 seconds, but then must rest for 38 seconds.
Prancer can fly 3 km/s for 21 seconds, but then must rest for 40 seconds.
Comet can fly 18 km/s for 6 seconds, but then must rest for 103 seconds.
Vixen can fly 18 km/s for 5 seconds, but then must rest for 84 seconds.

Comet can fly 14 km/s for 10 seconds, but then must rest for 127 seconds.
Dancer can fly 16 km/s for 11 seconds, but then must rest for 162 seconds.
