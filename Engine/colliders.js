class R_Bound
{
    constructor(R_Trans2D)
    {
        this.t = R_Trans2D;
        this.sect0 = [];
        this.sect1 = [];

        this.update();
    }

    isCollidingSub0(sect0)
    {
        // 2^LevelOfSubdivision (1)
        const sub = 2**1;

        // Section Dimensions
        const sW = C_RES.x/sub;
        const sH = C_RES.y/sub;

        // Section Position
        const sX = sect0%2*sW;
        const sY = Math.floor(sect0/2)*sH;

        // AABB Collision
        if (
            this.t.left()   < sX + sW &&
            this.t.right()  > sX &&
            this.t.top()    < sY + sH &&
            this.t.bottom() > sY
        ) return true;
        return false;
    }
    isCollidingSub1(sect0, sect1)
    {
        sect1 = sect1%4;
        // 2^LevelOfSubdivision (2)
        const sub = 2**2;

        // Section Dimensions
        const sW = C_RES.x/sub;
        const sH = C_RES.y/sub;

        // Section Position
        const sX = sect0%2*sW*2 + sect1%2*sW;
        const sY = Math.floor(sect0/2)*sH*2 + Math.floor(sect1/2)*sH;

        // AABB Collision
        if (
            this.t.left()   < sX + sW &&
            this.t.right()  > sX &&
            this.t.top()    < sY + sH &&
            this.t.bottom() > sY
        ) return true;
        return false;
    }

    update()
    {
        this.sect0 = [];
        this.sect1 = [];

        // Sections
        for (let i = 0; i < 4; i++)
            if (this.isCollidingSub0(i))
                this.sect0.push(i);

        if (this.sect0.length > 4)
        {
            console.error("First subdivision of Octree can't have more than 4 sections!");
            return;
        }

        
        for (let i = 0; i < this.sect0.length; i++)
        {
            for (let j = 0; j < 4; j++)
                if (this.isCollidingSub1(this.sect0[i], j))
                    this.sect1.push(this.sect0[i]*4+j);
        }

        return;
    }
}

class CircleCollider
{
    constructor(C_Trans2D)
    {
        this.t = C_Trans2D;
        this.bounds = new R_Bound( new R_Transform2D( new Vec2( this.t.left(), this.t.top() ), new Vec2( this.t.radius*2, this.t.radius*2 ) ) );
    }

    update()
    {
        this.bounds.t.pos = this.t.pos;
        this.bounds.t.dim = new Vec2(this.t.radius*2, this.t.radius*2);
        this.bounds.update();
    }

    collidesWith(collider)
    {
        return (collider.t.pos.sub(this.t.pos).mag() <= collider.t.radius+this.t.radius);
    }
}