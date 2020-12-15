#!/usr/bin/env ruby

require_relative '../input'

input=Input[DATA].r
ingrs={}
input.lines.each{ |l|
  ing,props=l.strip.split(": ")
  ingrs[ing]=props.split(", ").map{|pr| pr.split.last.to_i}
}
ev=->(amounts){
  sum=Array::new(ingrs.values.first.length,0)
  ingrs.each_with_index{ |(ingr,vals),ind|
    vals.each_with_index{ |v,i|
      sum[i]+=(amounts[ind]||0)*v
    }
  }
  [sum[0...-1].map{|s| [s,0].max}.reduce(:*),sum.last]
}
amounts={}
(1..100).each{ |a|
  (1..(100-a)).each{ |b|
    (1..(100-a-b)).each{ |c|
      am=[a,b,c,100-a-b-c]
      vv,cal=ev.(am)
      amounts[am]=vv if cal==500
    }
  }
}
p amounts.values.max

__END__
Sugar: capacity 3, durability 0, flavor 0, texture -3, calories 2
Sprinkles: capacity -3, durability 3, flavor 0, texture 0, calories 9
Candy: capacity -1, durability 0, flavor 4, texture 0, calories 1
Chocolate: capacity 0, durability 0, flavor -2, texture 2, calories 8

Butterscotch: capacity -1, durability -2, flavor 6, texture 3, calories 8
Cinnamon: capacity 2, durability 3, flavor -2, texture -1, calories 3
