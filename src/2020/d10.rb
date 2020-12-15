#!/usr/bin/env ruby

require_relative '../input'

input=Input[DATA].r
vals=input.lines.map(&:to_i)
vals<<0<<vals.max+3
vals.sort!
diffs=vals.each_cons(2).map{|a,b| b-a}.group_by{|d| d}.transform_values(&:length)
p diffs[1]*diffs[3]
ways=vals.map{0}
ways[0]=1
vals.each_with_index{ |val,i|
  j=i+1
  while j<vals.length and vals[j]<=val+3
    ways[j]+=ways[i]
    j+=1
  end
}
p ways.last

__END__
74
153
60
163
112
151
22
67
43
160
193
6
2
16
122
126
32
181
180
139
20
111
66
81
12
56
63
95
90
161
33
134
31
119
53
148
104
91
140
36
144
23
130
178
146
38
133
192
131
3
73
11
62
50
89
98
103
110
164
48
80
179
92
194
86
40
13
123
68
115
19
46
77
152
138
69
49
59
30
132
9
185
1
188
171
72
116
101
61
141
107
21
47
147
182
170
39
37
127
26
102
137
191
162
172
29
10
154
157
83
82
175
145
167

16
10
15
5
1
11
7
19
6
12
4

28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3