-- CreateEnum
CREATE TYPE "UsersStatus" AS ENUM ('Active', 'Banned');

-- CreateEnum
CREATE TYPE "UserSectionsStatus" AS ENUM ('Active', 'Banned');

-- CreateEnum
CREATE TYPE "UserSectionsOnlineStatus" AS ENUM ('Away', 'Online', 'Offline');

-- CreateEnum
CREATE TYPE "MoviesType" AS ENUM ('Movie', 'Series');

-- CreateEnum
CREATE TYPE "MoviesStatus" AS ENUM ('Draft', 'Published', 'Trash');

-- CreateEnum
CREATE TYPE "MovieReportsStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- CreateEnum
CREATE TYPE "PostsType" AS ENUM ('Post', 'Page');

-- CreateEnum
CREATE TYPE "PostsStatus" AS ENUM ('Draft', 'Published', 'Trash');

-- CreateEnum
CREATE TYPE "TaxonomiesType" AS ENUM ('Cast', 'Director', 'Country', 'Post_Category', 'Movie_Category', 'Tag');

-- CreateTable
CREATE TABLE "Assets" (
    "Id" SERIAL NOT NULL,
    "User_Ref" INTEGER,
    "Type" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Size" INTEGER,
    "Path" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Assets_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Libraries" (
    "Id" SERIAL NOT NULL,
    "User_Ref" INTEGER NOT NULL,
    "Type" TEXT NOT NULL,
    "Key" TEXT NOT NULL,
    "Value" TEXT,
    "Color" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Libraries_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Roles" (
    "Id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Permissions" (
    "Id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "RolePermissionRelationships" (
    "Role_Ref" INTEGER NOT NULL,
    "Permission_Ref" INTEGER NOT NULL,

    CONSTRAINT "RolePermissionRelationships_pkey" PRIMARY KEY ("Role_Ref","Permission_Ref")
);

-- CreateTable
CREATE TABLE "Users" (
    "Id" SERIAL NOT NULL,
    "Role_Ref" INTEGER NOT NULL,
    "UserName" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT,
    "IsAdministrator" BOOLEAN NOT NULL DEFAULT false,
    "FirstName" TEXT,
    "LastName" TEXT,
    "FullName" TEXT,
    "Status" "UsersStatus" NOT NULL DEFAULT 'Active',
    "ResetPasswordToken" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "UserSections" (
    "Id" SERIAL NOT NULL,
    "User_Ref" INTEGER,
    "Ip" TEXT,
    "Origin" TEXT,
    "UserAgent" TEXT,
    "Section_Id" TEXT,
    "Socket_Id" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "Service_Id" TEXT NOT NULL,
    "Status" "UserSectionsStatus" NOT NULL DEFAULT 'Active',
    "OnlineStatus" "UserSectionsOnlineStatus" NOT NULL DEFAULT 'Online',
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSections_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Movies" (
    "Id" SERIAL NOT NULL,
    "User_Ref" INTEGER NOT NULL,
    "Type" "MoviesType" NOT NULL DEFAULT 'Movie',
    "Title" TEXT NOT NULL,
    "Content" TEXT,
    "Slug" TEXT NOT NULL,
    "Status" "MoviesStatus" DEFAULT 'Draft',
    "Views" INTEGER DEFAULT 0,
    "Likes" INTEGER DEFAULT 0,
    "Comment" BOOLEAN DEFAULT true,
    "Password" TEXT,
    "Avatar" TEXT,
    "Original" TEXT,
    "Duration" INTEGER,
    "Quality" TEXT,
    "Quantity" INTEGER,
    "Trailer" TEXT,
    "Publish" INTEGER,
    "DatePublish" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "DateModified" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Movies_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "MovieEpisodes" (
    "Id" SERIAL NOT NULL,
    "User_Ref" INTEGER NOT NULL,
    "Movie_Ref" INTEGER NOT NULL,
    "Title" TEXT NOT NULL,
    "Slug" TEXT NOT NULL,
    "Order" INTEGER,
    "Source" TEXT,
    "Date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovieEpisodes_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "MovieRatings" (
    "Id" SERIAL NOT NULL,
    "Movie_Ref" INTEGER NOT NULL,
    "UserSection_Ref" INTEGER NOT NULL,
    "Value" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovieRatings_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "MovieReports" (
    "Id" SERIAL NOT NULL,
    "Movie_Ref" INTEGER NOT NULL,
    "UserSection_Ref" INTEGER NOT NULL,
    "Reason" TEXT NOT NULL,
    "Status" "MovieReportsStatus" DEFAULT 'Pending',
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovieReports_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Posts" (
    "Id" SERIAL NOT NULL,
    "User_Ref" INTEGER NOT NULL,
    "Type" "PostsType" NOT NULL DEFAULT 'Post',
    "Title" TEXT NOT NULL,
    "Content" TEXT,
    "Slug" TEXT NOT NULL,
    "Status" "PostsStatus" DEFAULT 'Draft',
    "Views" INTEGER DEFAULT 0,
    "Comment" BOOLEAN NOT NULL DEFAULT true,
    "Password" TEXT,
    "Avatar" TEXT,
    "DatePublish" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "DateModified" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Taxonomies" (
    "Id" SERIAL NOT NULL,
    "User_Ref" INTEGER NOT NULL,
    "Type" "TaxonomiesType" NOT NULL,
    "Name" TEXT NOT NULL,
    "Slug" TEXT NOT NULL,
    "Description" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Taxonomies_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "PostTaxonomyRelationships" (
    "Post_Ref" INTEGER NOT NULL,
    "Taxonomy_Ref" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "MovieTaxonomyRelationships" (
    "Movie_Ref" INTEGER NOT NULL,
    "Taxonomy_Ref" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "DynamicContents" (
    "Id" SERIAL NOT NULL,
    "Key" TEXT NOT NULL,
    "Value" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DynamicContents_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "DynamicContentHistories" (
    "Id" SERIAL NOT NULL,
    "User_Ref" INTEGER NOT NULL,
    "DynamicContent_Ref" INTEGER NOT NULL,
    "Value" TEXT,
    "PreviousValue" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DynamicContentHistories_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Logs" (
    "Id" SERIAL NOT NULL,
    "Type" TEXT NOT NULL,
    "Key" TEXT NOT NULL,
    "Log" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Libraries_Type_Key_key" ON "Libraries"("Type", "Key");

-- CreateIndex
CREATE UNIQUE INDEX "Roles_Name_key" ON "Roles"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "Permissions_Name_key" ON "Permissions"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "Users_UserName_key" ON "Users"("UserName");

-- CreateIndex
CREATE UNIQUE INDEX "Users_Email_key" ON "Users"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "UserSections_Service_Id_key" ON "UserSections"("Service_Id");

-- CreateIndex
CREATE UNIQUE INDEX "Movies_Title_key" ON "Movies"("Title");

-- CreateIndex
CREATE UNIQUE INDEX "Movies_Slug_key" ON "Movies"("Slug");

-- CreateIndex
CREATE UNIQUE INDEX "MovieEpisodes_Source_key" ON "MovieEpisodes"("Source");

-- CreateIndex
CREATE UNIQUE INDEX "MovieEpisodes_Movie_Ref_Title_Slug_key" ON "MovieEpisodes"("Movie_Ref", "Title", "Slug");

-- CreateIndex
CREATE UNIQUE INDEX "MovieRatings_Movie_Ref_UserSection_Ref_key" ON "MovieRatings"("Movie_Ref", "UserSection_Ref");

-- CreateIndex
CREATE UNIQUE INDEX "MovieReports_Movie_Ref_UserSection_Ref_key" ON "MovieReports"("Movie_Ref", "UserSection_Ref");

-- CreateIndex
CREATE UNIQUE INDEX "Posts_Title_key" ON "Posts"("Title");

-- CreateIndex
CREATE UNIQUE INDEX "Posts_Slug_key" ON "Posts"("Slug");

-- CreateIndex
CREATE UNIQUE INDEX "Taxonomies_Type_Name_Slug_key" ON "Taxonomies"("Type", "Name", "Slug");

-- CreateIndex
CREATE UNIQUE INDEX "PostTaxonomyRelationships_Post_Ref_Taxonomy_Ref_key" ON "PostTaxonomyRelationships"("Post_Ref", "Taxonomy_Ref");

-- CreateIndex
CREATE UNIQUE INDEX "MovieTaxonomyRelationships_Movie_Ref_Taxonomy_Ref_key" ON "MovieTaxonomyRelationships"("Movie_Ref", "Taxonomy_Ref");

-- CreateIndex
CREATE UNIQUE INDEX "DynamicContents_Key_key" ON "DynamicContents"("Key");

-- AddForeignKey
ALTER TABLE "Assets" ADD CONSTRAINT "Assets_User_Ref_fkey" FOREIGN KEY ("User_Ref") REFERENCES "Users"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Libraries" ADD CONSTRAINT "Libraries_User_Ref_fkey" FOREIGN KEY ("User_Ref") REFERENCES "Users"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissionRelationships" ADD CONSTRAINT "RolePermissionRelationships_Role_Ref_fkey" FOREIGN KEY ("Role_Ref") REFERENCES "Roles"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissionRelationships" ADD CONSTRAINT "RolePermissionRelationships_Permission_Ref_fkey" FOREIGN KEY ("Permission_Ref") REFERENCES "Permissions"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_Role_Ref_fkey" FOREIGN KEY ("Role_Ref") REFERENCES "Roles"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSections" ADD CONSTRAINT "UserSections_User_Ref_fkey" FOREIGN KEY ("User_Ref") REFERENCES "Users"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movies" ADD CONSTRAINT "Movies_User_Ref_fkey" FOREIGN KEY ("User_Ref") REFERENCES "Users"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieEpisodes" ADD CONSTRAINT "MovieEpisodes_User_Ref_fkey" FOREIGN KEY ("User_Ref") REFERENCES "Users"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieEpisodes" ADD CONSTRAINT "MovieEpisodes_Movie_Ref_fkey" FOREIGN KEY ("Movie_Ref") REFERENCES "Movies"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieRatings" ADD CONSTRAINT "MovieRatings_Movie_Ref_fkey" FOREIGN KEY ("Movie_Ref") REFERENCES "Movies"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieRatings" ADD CONSTRAINT "MovieRatings_UserSection_Ref_fkey" FOREIGN KEY ("UserSection_Ref") REFERENCES "UserSections"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieReports" ADD CONSTRAINT "MovieReports_Movie_Ref_fkey" FOREIGN KEY ("Movie_Ref") REFERENCES "Movies"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieReports" ADD CONSTRAINT "MovieReports_UserSection_Ref_fkey" FOREIGN KEY ("UserSection_Ref") REFERENCES "UserSections"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_User_Ref_fkey" FOREIGN KEY ("User_Ref") REFERENCES "Users"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Taxonomies" ADD CONSTRAINT "Taxonomies_User_Ref_fkey" FOREIGN KEY ("User_Ref") REFERENCES "Users"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostTaxonomyRelationships" ADD CONSTRAINT "PostTaxonomyRelationships_Post_Ref_fkey" FOREIGN KEY ("Post_Ref") REFERENCES "Posts"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostTaxonomyRelationships" ADD CONSTRAINT "PostTaxonomyRelationships_Taxonomy_Ref_fkey" FOREIGN KEY ("Taxonomy_Ref") REFERENCES "Taxonomies"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieTaxonomyRelationships" ADD CONSTRAINT "MovieTaxonomyRelationships_Movie_Ref_fkey" FOREIGN KEY ("Movie_Ref") REFERENCES "Movies"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieTaxonomyRelationships" ADD CONSTRAINT "MovieTaxonomyRelationships_Taxonomy_Ref_fkey" FOREIGN KEY ("Taxonomy_Ref") REFERENCES "Taxonomies"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DynamicContentHistories" ADD CONSTRAINT "DynamicContentHistories_User_Ref_fkey" FOREIGN KEY ("User_Ref") REFERENCES "Users"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DynamicContentHistories" ADD CONSTRAINT "DynamicContentHistories_DynamicContent_Ref_fkey" FOREIGN KEY ("DynamicContent_Ref") REFERENCES "DynamicContents"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
